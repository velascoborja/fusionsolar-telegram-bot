import { Creator } from "./creator";

export interface Like {
    id: number;
    name: string;
    url: string;
    public_url: string;
    created_at: Date;
    thumbnail: string;
    preview_image: string;
    creator: Creator;
    is_private: number;
    is_purchased: number;
    is_published: number;
    comment_count: number;
    like_count: number;
    tags: Tag[];
    is_nsfw?: any;
}

export interface Tag {
    name: string;
    url: string;
    count: number;
    things_url: string;
    absolute_url: string;
}

