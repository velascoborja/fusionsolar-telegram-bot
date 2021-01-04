export interface Size {
    type: string;
    size: string;
    url: string;
}

export interface DefaultImage {
    id: number;
    url: string;
    name: string;
    sizes: Size[];
    added: Date;
}

export interface File {
    id: number;
    name: string;
    size: number;
    url: string;
    public_url: string;
    download_url: string;
    threejs_url: string;
    thumbnail: string;
    default_image: DefaultImage;
    date: string;
    formatted_size: string;
    meta_data: any[];
    download_count: number;
}