import axios, { AxiosInstance } from 'axios'
import { Device } from '../../models/device';
import { DeviceRealTime } from '../../models/deviceRealTime';
import { MeterDataItemMap, MeterRealTime } from '../../models/meterRealTime';
import { Plant } from '../../models/plant'
import { PlantRealTime } from '../../models/plantRealTime';
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
        return post(this.api, `getDevList`, this.db, userId, { stationCodes: `${plantId}` })
    }

    getPlantRealStatus(plantId: string, userId: string): Promise<FusionSolarResponse<Array<PlantRealTime>>> {
        return post(this.api, `getStationRealKpi`, this.db, userId, { stationCodes: `${plantId}` })
    }

    async getInverterForPlantId(plantId: string, userId: string): Promise<FusionSolarResponse<Array<DeviceRealTime>>> {
        let inverterId = await this.getDevicesForPlantId(plantId, userId).then(function (response) {
            let devices = response.data
            let inverterId = devices.find(element => element.devTypeId == 38).id
            return inverterId
        })

        return post(this.api, `getDevRealKpi`, this.db, userId, {
            "devIds": inverterId,
            "devTypeId": 38
        })
    }

    async getMeterForPlantId(plantId: string, userId: string): Promise<FusionSolarResponse<Array<MeterRealTime>>> {
        let meterId = await this.getDevicesForPlantId(plantId, userId).then(function (response) {
            let devices = response.data
            let meterId = devices.find(element => element.devTypeId == 47).id
            return meterId
        })

        return post(this.api, `getDevRealKpi`, this.db, userId, {
            "devIds": meterId,
            "devTypeId": 47
        })
    }
}

export default FusionSolar
