export interface Creator {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    url: string;
    public_url: string;
    thumbnail: string;
    count_of_followers: number;
    count_of_following: number;
    count_of_designs: number;
    accepts_tips: boolean;
    is_following: boolean;
    location: string;
    cover: string;
}
