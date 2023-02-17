export class Status {
    instantPowerConsumption: number
    instantSolarYield: number
    dailyYield:number

    constructor(powerConsumption: number, solarYield: number, dailyYield: number) {
        this.instantPowerConsumption = powerConsumption
        this.instantSolarYield = solarYield,
        this.dailyYield = dailyYield

    }
}