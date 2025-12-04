import { addonBuilder, serveHTTP } from 'stremio-addon-sdk';
import { extractStream } from './extractor';
import { AddonManifest } from './types';

const manifest: AddonManifest = {
    id: 'vixsrc.addon',
    version: '1.0.0',
    name: 'VixSRC',
    description: 'Streaming addon powered by VixSRC.to',
    resources: ['stream'],
    types: ['movie', 'series'],
    idPrefixes: ['tt'],
    catalogs: []
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async (args) => {
    const { type, id, extra } = args;
    
    try {
        const streams = await extractStream(type, id, extra);
        return { streams };
    } catch (error) {
        console.error('Stream extraction error:', error);
        return { streams: [] };
    }
});

const PORT = process.env.PORT || 56245;
serveHTTP(builder.getInterface(), { port: PORT });
console.log(`VixSRC addon running on port ${PORT}`);
