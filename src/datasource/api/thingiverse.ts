import axios, { AxiosInstance } from 'axios'
import { Collection } from '../../models/collection';
import { File } from '../../models/file';
import { Hits } from '../../models/hits';
import { Make } from '../../models/make';
import { Thing } from '../../models/thing';
import { Zip } from '../../models/zip';
import { get } from './utils';

class Thingiverse {

    private api: AxiosInstance

    constructor(token: string) {
        this.api = axios.create({
            baseURL: 'https://api.thingiverse.com/',
            timeout: 15000,
            headers: { 'authorization': `Bearer ${token}` }
        })
    }

    getUserLikes(userName: string): Promise<Array<Thing>> {
        return get(this.api, `users/${userName}/likes`)
    }

    getUserCollections(userName: string): Promise<Array<Collection>> {
        return get(this.api, `users/${userName}/collections`)
    }

    getItemsForCollection(collectionId: string): Promise<Array<Thing>> {
        return get(this.api, `collections/${collectionId}/things`)
    }

    getCollectionForId(collectionId: string): Promise<Collection> {
        return get(this.api, `collections/${collectionId}`)
    }

    getUsersDesigns(userName: string): Promise<Array<Thing>> {
        return get(this.api, `users/${userName}/things`)
    }

    getFiles(thingId: any): Promise<Array<File>> {
        return get(this.api, `things/${thingId}/files`)
    }

    getPublicZipUrlForThing(thingId: any): Promise<Zip> {
        return get(this.api, `things/${thingId}/package-url`)
    }

    searchThingsByTag(tag: string): Promise<Array<Thing>> {
        return get(this.api, `tags/${tag}/things`)

    }

    searchThings(search: string): Promise<Hits> {
        return get(this.api, `search/${search}`)
    }

    getUserMakes(userName: string): Promise<Array<Make>> {
        return get(this.api, `users/${userName}/copies`)
    }
}

export default Thingiverse