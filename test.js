const axios = require('axios');

const BASE_URL = 'http://localhost:56245';

async function testAddon() {
    console.log('🧪 Testing VixSRC Addon...\n');
    
    const tests = [
        {
            name: 'Film con IMDB ID',
            url: `${BASE_URL}/stream/movie/tt0111161.json`
        },
        {
            name: 'Serie TV con stagione ed episodio',
            url: `${BASE_URL}/stream/series/tt0944947:1:1.json`
        }
    ];

    for (const test of tests) {
        try {
            console.log(`Testing: ${test.name}`);
            const response = await axios.get(test.url);
            console.log(`✅ Success: ${response.data.streams?.length || 0} streams found\n`);
        } catch (error) {
            console.log(`❌ Error: ${error.message}\n`);
        }
    }
}

testAddon();
