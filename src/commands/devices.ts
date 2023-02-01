import { Markup, Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import FusionSolar from "../datasource/api/fusionsolar"
import { FusionSolarResponse } from "../datasource/api/models/response"
import DatabaseDataSource from "../datasource/db/DatabaseDataSource"
import { Device } from "../models/device"
import { Plant } from "../models/plant"

function commandDevices(bot: Telegraf<any>, fusionsolar: FusionSolar) {

    bot.command('devices', async (ctx) => {
        loadDevices(fusionsolar, ctx)
    })

    bot.action(/device (.+)/, async (ctx) => {
        ctx.reply("⏳ Loading plant devices...")
        const userId = ctx.from?.id.toString()

        const plantId = ctx.match[1]

        fusionsolar.getDevicesForPlantId(plantId, userId).then(function (response) {
            loadPlantDevices(fusionsolar, ctx, response.data)
        }).catch(function (error) {
            ctx.reply(`👎 Error retrieving your devices: ${error}`)
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
            ctx.reply("Couldn't retrieve yout devices 🤷‍♂️")
        })
}

async function loadPlantDevices(fusionsolar: FusionSolar, ctx: TelegrafContext, devices: Array<Device>) {
    if (devices == null || devices.length == 0) {
        ctx.reply(`👎 Error retrieving plant devices`)
    } else {
        ctx.reply("👨‍💻 These are your plant's devices:")

        devices.forEach(function (value) {
            ctx.reply(`Device name: ${value.devName}\nType ID: ${value.devTypeId}\nInverter type: ${value.invType}\nSoftware version: ${value.softwareVersion}`)
        })
    }
}

export default commandDevices