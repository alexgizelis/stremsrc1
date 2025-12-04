import puppeteer from 'puppeteer';
import { convertImdbToTmdb } from './utils';
import { StreamResponse, StreamExtra } from './types';

const VIXSRC_BASE_URL = 'https://vidlink.pro';

export async function extractStream(
    type: string,
    id: string,
    extra?: StreamExtra
): Promise<StreamResponse[]> {
    let tmdbId = id;

    if (id.startsWith('tt')) {
        tmdbId = await convertImdbToTmdb(id, type);
        if (!tmdbId) throw new Error('Unable to convert IMDB ID to TMDB ID');
    }

    let embedUrl: string;
    if (type === 'movie') {
        embedUrl = `${VIXSRC_BASE_URL}/movie/${tmdbId}`;
    } else if (type === 'series') {
        const season = extra?.season || '1';
        const episode = extra?.episode || '1';
        embedUrl = `${VIXSRC_BASE_URL}/tv/${tmdbId}/${season}/${episode}`;
    } else {
        throw new Error('Unsupported content type');
    }

    const params = new URLSearchParams({
        primaryColor: '63b8bc',
        secondaryColor: 'a2a2a2',
        iconColor: 'eefdec',
        icons: 'vid',
        player: 'jw',
        title: 'false',
        poster: 'false',
        autoplay: 'false',
        nextbutton: 'false'
    });

    const finalUrl = `${embedUrl}?${params.toString()}`;

    // 🚀 Launch Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    let videoSrc: string | undefined;

    // Intercept network requests to catch .m3u8 or .mp4
    page.on('response', async (response) => {
        const url = response.url();
        if (url.includes('.m3u8') || url.includes('.mp4')) {
            videoSrc = url;
        }
    });

    await page.goto(finalUrl, { waitUntil: 'networkidle2' });

    // Wait a bit for player to load
    await page.waitForTimeout(5000);

    await browser.close();

    if (!videoSrc) {
        throw new Error('No playable stream found');
    }

    return [{
        name: 'VixSRC',
        title: 'VixSRC Stream',
        url: videoSrc, // ✅ direct stream link
        behaviorHints: {
            notWebReady: false,
            bingeGroup: 'vixsrc-group'
        }
    }];
}
