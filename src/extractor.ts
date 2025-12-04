import axios from 'axios';
import * as cheerio from 'cheerio';
import { convertImdbToTmdb } from './utils';
import { StreamResponse, StreamExtra } from './types';

const VIXSRC_BASE_URL = 'https://vidlink.pro';

export async function extractStream(
    type: string,
    id: string,
    extra?: StreamExtra
): Promise<StreamResponse[]> {
    try {
        let tmdbId = id;

        // Convert IMDB ID to TMDB ID if needed
        if (id.startsWith('tt')) {
            tmdbId = await convertImdbToTmdb(id, type);
            if (!tmdbId) {
                throw new Error('Unable to convert IMDB ID to TMDB ID');
            }
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

        // Add custom params
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

        // 🔍 Fetch the embed page
        const { data } = await axios.get(finalUrl);
        const $ = cheerio.load(data);

        // Try to extract a direct video source
        let videoSrc: string | undefined;

        // Case 1: <video><source src="..."></video>
        videoSrc = $('video source').attr('src');

        // Case 2: iframe player
        if (!videoSrc) {
            videoSrc = $('iframe').attr('src');
        }

        // Case 3: JWPlayer config (common on vidlink)
        if (!videoSrc) {
            const scriptTag = $('script').filter((i, el) =>
                $(el).html()?.includes('jwplayer')
            ).html();

            if (scriptTag) {
                const match = scriptTag.match(/file:\s*"(.*?)"/);
                if (match) {
                    videoSrc = match[1];
                }
            }
        }

        if (!videoSrc) {
            throw new Error('No playable stream found');
        }

        return [{
            name: 'VixSRC',
            title: 'VixSRC Stream',
            url: videoSrc, // ✅ direct stream link
            behaviorHints: {
                notWebReady: false, // now it’s playable
                bingeGroup: 'vixsrc-group'
            }
        }];
    } catch (error) {
        console.error('Extraction error:', error);
        return [];
    }
}
