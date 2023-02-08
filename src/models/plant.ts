export class Plant {
    aidType: string
    buildState: string
    capacity: string
    combineType: string
    linkmanPho: string
    stationAddr: string
    stationCode: string
    stationLinkman: string
    stationName: string
    userId: string

    static toMessage(plant: Plant): string {
        return `🏠 ${plant.stationName}\n🙋‍♂️ ${plant.stationLinkman}\n🔐 ${plant.stationCode}`
    }

    static updateWithUserId(plant: Plant, userId: string): Plant {
        plant.userId = userId
        return plant
    }
}

