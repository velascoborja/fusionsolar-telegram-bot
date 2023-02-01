import axios, { AxiosInstance } from 'axios'
import { Device } from '../../models/device';
import { Plant } from '../../models/plant'
import DatabaseDataSource from '../db/DatabaseDataSource';
import { FusionSolarResponse } from './models/response';
import { post } from './utils';

class FusionSolar {

    private api: AxiosInstance
    private db: DatabaseDataSource

    constructor(db: DatabaseDataSource) {
        this.api = axios.create({
            baseURL: 'https://intl.fusionsolar.huawei.com/thirdData/',
            timeout: 15000
        })
        this.db = db
    }

    getStations(userId: string): Promise<FusionSolarResponse<Array<Plant>>> {
        return post(this.api, `getStationList`, this.db, userId)
    }

    getDevicesForPlantId(plantId: string, userId: string): Promise<FusionSolarResponse<Array<Device>>> {
        return post(this.api, `getDevList`, this.db, userId, { stationCodes : `${plantId}` })
    }
}

export default FusionSolar
