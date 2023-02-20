import axios, { AxiosInstance } from 'axios'
import { isParenthesizedExpression } from 'typescript';
import { Device } from '../../models/device';
import { DeviceRealTime } from '../../models/deviceRealTime';
import { MeterDataItemMap, MeterRealTime } from '../../models/meterRealTime';
import { Plant } from '../../models/plant'
import { PlantDailyBalance } from '../../models/plantDailyBalance';
import { PlantRealTime } from '../../models/plantRealTime';
import { Status } from '../../models/status';
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

    async getStations(userId: string): Promise<Array<Plant>> {
        const dataBase = this.db
        let storedPlants = await this.db.getPlantsForUserId(userId)

        if (storedPlants != null && storedPlants.length > 0) return storedPlants

        return post(this.api, `getStationList`, this.db, userId).then(function (response) {
            let plants = response.data as Array<Plant>
            dataBase.insertOrUpdateUserPlants(plants.map(function (plant) {
                return Plant.updateWithUserId(plant, userId)
            }))
            return plants
        })
    }

    async getDevicesForPlantId(plantId: string, userId: string): Promise<Array<Device>> {
        const dataBase = this.db
        let storedDevices = await this.db.getDevicesForPlantId(plantId)

        if (storedDevices != null && storedDevices.length > 0) return storedDevices

        return post(this.api, `getDevList`, this.db, userId, { stationCodes: `${plantId}` }).then(function (response) {
            let devices = response.data as Array<Device>
            dataBase.insertOrUpdatePlantDevices(devices)
            return devices
        })
    }

    getPlantRealStatus(plantId: string, userId: string): Promise<FusionSolarResponse<Array<PlantRealTime>>> {
        return post(this.api, `getStationRealKpi`, this.db, userId, { stationCodes: `${plantId}` })
    }

    async getInverterForPlantId(plantId: string, userId: string): Promise<FusionSolarResponse<Array<DeviceRealTime>>> {
        let inverterId = await this.getDevicesForPlantId(plantId, userId).then(function (devices) {
            let inverterId = devices.find(element => element.devTypeId == 38).id
            return inverterId
        })

        return post(this.api, `getDevRealKpi`, this.db, userId, {
            "devIds": inverterId,
            "devTypeId": 38
        })
    }

    async getMeterForPlantId(plantId: string, userId: string): Promise<FusionSolarResponse<Array<MeterRealTime>>> {
        let meterId = await this.getDevicesForPlantId(plantId, userId).then(function (devices) {
            let meterId = devices.find(element => element.devTypeId == 47).id
            return meterId
        })

        return post(this.api, `getDevRealKpi`, this.db, userId, {
            "devIds": meterId,
            "devTypeId": 47
        })
    }

    async getStatus(plantId: string, userId: string): Promise<Status> {
        let inverterStatus = await this.getInverterForPlantId(plantId, userId)
        let meterStatus = await this.getMeterForPlantId(plantId, userId)

        let instantPowerConsumption = meterStatus.data[0].dataItemMap.active_power
        let instantSolarYield = inverterStatus.data[0].dataItemMap.active_power
        let dailyYield = inverterStatus.data[0].dataItemMap.day_cap

        return new Promise((resolve, reject) => {
            resolve(new Status(instantPowerConsumption, instantSolarYield, dailyYield))
        })
    }

    async getPlantDailyKpi(plantId: string, userId: string): Promise<PlantDailyBalance> {
        let currentTimeMillis = Date.now()
        let dailyBalance = await post(this.api, `getKpiStationDay`, this.db, userId, { stationCodes: `${plantId}`, collectTime: `${currentTimeMillis}` })

        let currentDayBalance = dailyBalance.data[(dailyBalance.data as Array<any>).length - 1].dataItemMap

        let imported = currentDayBalance.use_power
        let exported = currentDayBalance.ongrid_power

        return new Promise((resolve, reject) => {
            resolve(new PlantDailyBalance(exported, imported))
        })
    }
}

export default FusionSolar
