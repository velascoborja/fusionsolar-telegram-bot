export interface DeviceDataItemMap {
    pv1_u: number;
    pv2_u: number;
    pv3_u: number;
    pv4_u: number;
    pv5_u: number;
    power_factor: number;
    pv6_u: number;
    pv7_u: number;
    pv8_u: number;
    open_time: number;
    inverter_state: number;
    a_i: number;
    total_cap: number;
    c_i: number;
    mppt_3_cap: number;
    b_i: number;
    reactive_power: number;
    a_u: number;
    temperature: number;
    c_u: number;
    bc_u: number;
    b_u: number;
    elec_freq: number;
    mppt_4_cap: number;
    efficiency: number;
    day_cap: number;
    mppt_power: number;
    run_state: number;
    close_time: number;
    mppt_1_cap: number;
    pv1_i: number;
    pv2_i: number;
    pv3_i: number;
    mppt_2_cap: number;
    active_power: number;
    pv4_i: number;
    pv5_i: number;
    ab_u: number;
    ca_u: number;
    pv6_i: number;
    pv7_i: number;
    pv8_i: number;
}

export interface DeviceRealTime {
    stationCode: string;
    dataItemMap: DeviceDataItemMap;
}

