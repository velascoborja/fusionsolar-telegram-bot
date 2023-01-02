import axios, { AxiosInstance } from 'axios'
import { Station } from '../../models/station';
import { get, post } from './utils';

class FusionSolar {

    private api: AxiosInstance

    constructor(token: string) {

        this.api = axios.create({
            baseURL: 'https://intl.fusionsolar.huawei.com/thirdData/',
            timeout: 15000,
            headers: { 'XSRF-TOKEN': `${token}` }
        })

        this.api.interceptors.response.use((response) => {
            if (response.data.failCode == 305) {
                this.relogin()
            } else return response
        })
    }

    getStations(): Promise<Array<Station>> {
        return post(this.api, `getStationList`)
    }

    relogin(): Promise<string> {
        return post(this.api, `login`, {
            "userName": "borjavelasco",
            "systemCode": "12345678aA"
        })
    }
}

export default FusionSolar
