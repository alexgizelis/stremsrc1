import axios from 'axios';
import * as cheerio from 'cheerio';
import { convertImdbToTmdb } from './utils';
import { StreamResponse, StreamExtra } from './types';

const VIXSRC_BASE_URL = 'https://vidlink.pro';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function extractStream(
    type: string, 
    id: string, 
    extra?: StreamExtra
): Promise<StreamResponse[]> {
    try {
        let tmdbId = id;
        
        // Converti IMDB ID a TMDB ID se necessario
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

        // Aggiungi parametri personalizzati VixSRC
        const params = new URLSearchParams({
            primaryColor: 'B20710',
            secondaryColor: '170000',
            autoplay: 'true',
            lang: 'en'
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
