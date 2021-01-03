import axios, { AxiosInstance } from 'axios'
import { Collection } from '../models/collection';
import { Thing } from '../models/thing';

class Thingiverse {
    
    private api: AxiosInstance

    constructor(token: string) {
        this.api = axios.create({
            baseURL: 'https://api.thingiverse.com/',
            timeout: 15000,
            headers: { 'authorization': `Bearer ${token}` }
        })
    }

    getLikes(userName: string): Promise<Array<Thing>> {
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

    getCollections(userName: string): Promise<Array<Collection>> {
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

    getCollectionItems(collectionId: string) : Promise<Array<Thing>>{
        return new Promise((resolve, reject) => {
            this.api.get(`collections/${collectionId}/things`)
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