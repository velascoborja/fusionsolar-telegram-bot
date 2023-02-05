import { Markup, Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import FusionSolar from "../datasource/api/fusionsolar"
import { FusionSolarResponse } from "../datasource/api/models/response"
import DatabaseDataSource from "../datasource/db/DatabaseDataSource"
import { Device } from "../models/device"
import { DeviceDataItemMap } from "../models/deviceRealTime"
import { MeterDataItemMap } from "../models/meterRealTime"
import { Plant } from "../models/plant"

function commandDevices(bot: Telegraf<any>, fusionsolar: FusionSolar) {

    bot.command('devices', async (ctx) => {
        loadDevices(fusionsolar, ctx)
    })

    bot.command('inverter', async (ctx) => {
        loadInverter(fusionsolar, ctx)
    })

    bot.command('meter', async (ctx) => {
        loadMeter(fusionsolar, ctx)
    })

    bot.action(/device (.+)/, async (ctx) => {
        ctx.reply("⏳ Loading plant devices...")
        const userId = ctx.from?.id.toString()

        const plantId = ctx.match[1]

        fusionsolar.getDevicesForPlantId(plantId, userId).then(function (response) {
            showPlantDevices(fusionsolar, ctx, response.data)
        }).catch(function (error) {
            ctx.reply(`👎 Error retrieving your devices: ${error}`)
        })
    })

    bot.action(/inverter (.+)/, async (ctx) => {
        ctx.reply("⏳ Loading plant inverter info...")
        const userId = ctx.from?.id.toString()

        const plantId = ctx.match[1]

        fusionsolar.getInverterForPlantId(plantId, userId).then(function (response) {
            showInverterInfo(ctx, response.data[0].dataItemMap)
        }).catch(function (error) {
            ctx.reply(`👎 Error retrieving your devices`)
        })
    })

    bot.action(/meter (.+)/, async (ctx) => {
        ctx.reply("⏳ Loading plant meter info...")
        const userId = ctx.from?.id.toString()

        const plantId = ctx.match[1]

        fusionsolar.getMeterForPlantId(plantId, userId).then(function (response) {
            showMeterInfo(ctx, response.data[0].dataItemMap)
        }).catch(function (error) {
            ctx.reply(`👎 Error retrieving your meter info`)
        })
    })
}

async function loadDevices(fusionsolar: FusionSolar, ctx: TelegrafContext) {
    ctx.reply("⏳ Loading plant devices...")
    const userId = ctx.message?.from?.id.toString()

    fusionsolar.getStations(userId)
        .then(async function (response: FusionSolarResponse<Array<Plant>>) {

            const plantsKeyboard = Markup.inlineKeyboard(response.data.map(it =>
                Markup.callbackButton(it.stationName, `device ${it.stationCode}`))).extra()

            ctx.reply(
                "☀️ Select a plant for retrieving devices",
                plantsKeyboard
            )
        })
        .catch(function (error) {
            ctx.reply("Couldn't retrieve your devices 🤷‍♂️")
        })
}

async function loadInverter(fusionsolar: FusionSolar, ctx: TelegrafContext) {
    ctx.reply("⏳ Loading plants...")
    const userId = ctx.message?.from?.id.toString()

    fusionsolar.getStations(userId)
        .then(async function (response: FusionSolarResponse<Array<Plant>>) {

            const plantsKeyboard = Markup.inlineKeyboard(response.data.map(it =>
                Markup.callbackButton(it.stationName, `inverter ${it.stationCode}`))).extra()

            ctx.reply(
                "☀️ Select a plant for retrieving inverter info",
                plantsKeyboard
            )
        })
        .catch(function (error) {
            ctx.reply("Couldn't retrieve your inverter info 🤷‍♂️")
        })
}

async function loadMeter(fusionsolar: FusionSolar, ctx: TelegrafContext) {
    ctx.reply("⏳ Loading plants...")
    const userId = ctx.message?.from?.id.toString()

    fusionsolar.getStations(userId)
        .then(async function (response: FusionSolarResponse<Array<Plant>>) {

            const plantsKeyboard = Markup.inlineKeyboard(response.data.map(it =>
                Markup.callbackButton(it.stationName, `meter ${it.stationCode}`))).extra()

            ctx.reply(
                "☀️ Select a plant for retrieving meter info",
                plantsKeyboard
            )
        })
        .catch(function (error) {
            ctx.reply("Couldn't retrieve your meter info 🤷‍♂️")
        })
}

async function showPlantDevices(fusionsolar: FusionSolar, ctx: TelegrafContext, devices: Array<Device>) {
    if (devices == null || devices.length == 0) {
        ctx.reply(`👎 Error retrieving plant devices`)
    } else {
        ctx.reply("👨‍💻 These are your plant's devices:")

        devices.forEach(function (value) {
            ctx.reply(`Device name: ${value.devName}\nType ID: ${value.devTypeId}\nInverter type: ${value.invType}\nSoftware version: ${value.softwareVersion}`)
        })
    }
}

function showInverterInfo(ctx: TelegrafContext, inverterData: DeviceDataItemMap) {
    ctx.reply("⚡️ This is your inverter info:")
    ctx.reply(`Active power: ${inverterData.active_power}\nTemperature: ${inverterData.temperature}\nEfficiency: ${inverterData.efficiency}\nReactive power: ${inverterData.reactive_power}`)
}

function showMeterInfo(ctx: TelegrafContext, meterData: MeterDataItemMap) {
    ctx.reply("⚡️ This is your meter info:")
    ctx.reply(`Active power: ${meterData.active_power}\nFrecuency: ${meterData.grid_frequency}\nVoltage: ${meterData.meter_u}\nReactive power: ${meterData.reactive_power}`)
}

export default commandDevices

