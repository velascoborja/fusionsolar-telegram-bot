import { Thing } from "./thing";

export interface Hits {
    total: number;
    hits: Thing[];
}