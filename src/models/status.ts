export class Status {
    instantPowerConsumption: number
    instantSolarYield: number

    constructor(powerConsumption: number, solarYield: number) {
        this.instantPowerConsumption = powerConsumption
        this.instantSolarYield = solarYield
    }
}