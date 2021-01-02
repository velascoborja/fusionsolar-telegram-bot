import { Creator } from "./creator";

export interface Collection  {
    id: number;
    name: string;
    description: string;
    added: Date;
    modified: Date;
    creator: Creator;
    url: string;
    count: number;
    is_editable: boolean;
    preview_image: string;
    absolute_url: string;
    thumbnail: string;
    thumbnail_1: string;
    thumbnail_2: string;
    thumbnail_3: string;
}

