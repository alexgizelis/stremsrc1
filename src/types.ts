export interface AddonManifest {
    id: string;
    version: string;
    name: string;
    description: string;
    resources: string[];
    types: string[];
    idPrefixes: string[];
    catalogs: any[];
}

export interface StreamExtra {
    season?: string;
    episode?: string;
}

export interface StreamResponse {
    name: string;
    title: string;
    url: string;
    behaviorHints?: {
        notWebReady?: boolean;
        bingeGroup?: string;
    };
}
