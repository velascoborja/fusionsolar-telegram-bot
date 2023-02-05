export interface MeterDataItemMap {
    meter_status: number;
    active_cap: number;
    meter_i: number;
    reverse_active_cap: number;
    power_factor: number;
    reactive_power: number;
    active_power: number;
    run_state: number;
    meter_u: number;
    grid_frequency: number;
}

export interface MeterRealTime {
    stationCode: string;
    dataItemMap: MeterDataItemMap;
}

