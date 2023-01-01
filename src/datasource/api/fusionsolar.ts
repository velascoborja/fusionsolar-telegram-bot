import axios, { AxiosInstance } from 'axios'
import { Station } from '../../models/station';
import { get } from './utils';

class FusionSolar {
    getCategoryForId(categoryId: any) {
        throw new Error("Method not implemented.");
    }

    private api: AxiosInstance

    constructor(token: string) {
        this.api = axios.create({
            baseURL: 'https://intl.fusionsolar.huawei.com/thirdData/',
            timeout: 15000,
            headers: { 'XSRF-TOKEN': `${token}` }
        })
    }

    getUserLikes(): Promise<Array<Station>> {
        return get(this.api, `getStationList`)
    }
}

export default FusionSolar