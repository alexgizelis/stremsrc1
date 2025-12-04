import axios from 'axios';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function convertImdbToTmdb(imdbId: string, type: string): Promise<string | null> {
    try {
        const response = await axios.get(
            `${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
        );

        const results = response.data;
        
        if (type === 'movie' && results.movie_results?.length > 0) {
            return results.movie_results[0].id.toString();
        } else if (type === 'series' && results.tv_results?.length > 0) {
            return results.tv_results[0].id.toString();
        }

        return null;
    } catch (error) {
        console.error('TMDB conversion error:', error);
        return null;
    }
}
