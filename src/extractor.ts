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

        // Full set of custom parameters
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

        return [{
            name: 'VixSRC',
            title: 'VixSRC Stream',
            url: finalUrl,
            behaviorHints: {
                notWebReady: true,
                bingeGroup: 'vixsrc-group'
            }
        }];
    } catch (error) {
        console.error('Extraction error:', error);
        return [];
    }
}
