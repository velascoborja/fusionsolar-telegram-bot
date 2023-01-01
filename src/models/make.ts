import { Thing } from "./station";

export interface Make {
    id: number;
    url: string;
    public_url: string;
    added: Date;
    like_count: number;
    comment_count: number;
    description: string;
    description_html: string;
    is_liked: boolean;
    thing: Thing;
    thumbnail: string;
    preview_image: string;
    images_url: string;
}