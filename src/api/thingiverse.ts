import axios, { AxiosInstance } from 'axios'
import { Collection } from '../models/collection';
import { Like } from '../models/like';

class Thingiverse {

    private api: AxiosInstance

    constructor(token: string) {
        this.api = axios.create({
            baseURL: 'https://api.thingiverse.com/',
            timeout: 1000,
            headers: { 'authorization': `Bearer ${token}` }
        })
    }

    public getLikes(userName: string): Promise<Array<Like>> {
        return new Promise((resolve, reject) => {
            this.api.get(`users/${userName}/likes`)
                .then(async function (response) {
                    resolve(response.data)
                })
                .catch(function (error) {
                    reject(error)
                })
        })
    }

    public getCollections(userName: string): Promise<Array<Collection>> {
        return new Promise((resolve, reject) => {
            this.api.get(`users/${userName}/collections`)
                .then(async function (response) {
                    resolve(response.data)
                })
                .catch(function (error) {
                    reject(error)
                })
        })
    }
}

export default Thingiverse