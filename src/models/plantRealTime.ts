export interface DataItemMap {
    total_income: number;
    total_power: number;
    day_power: number;
    day_income: number;
    real_health_state: number;
    month_power: number;
}

export interface PlantRealTime {
    stationCode: string;
    dataItemMap: DataItemMap;
}

