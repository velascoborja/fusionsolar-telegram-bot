import { Markup, Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import FusionSolar from "../datasource/api/fusionsolar"
import { FusionSolarResponse } from "../datasource/api/models/response"
import DatabaseDataSource from "../datasource/db/DatabaseDataSource"
import { Device } from "../models/device"
import { DeviceDataItemMap } from "../models/deviceRealTime"
import { MeterDataItemMap } from "../models/meterRealTime"
import { Plant } from "../models/plant"

function commandStatus(bot: Telegraf<any>, fusionsolar: FusionSolar) {

    bot.command('status', async (ctx) => {
        loadCurrentStatus(fusionsolar, ctx)
    })

    bot.action(/plantStatus (.+)/, async (ctx) => {
        ctx.reply("⏳ Loading plant status...")
        const userId = ctx.from?.id.toString()

        const plantId = ctx.match[1]

        fusionsolar.getInverterForPlantId(plantId, userId)
            .then(function (promises) {
                return fusionsolar.getMeterForPlantId(plantId, userId)
            })
            .then(function (promises) {
                ""
                // "showInverterInfo(ctx, response.data[0].dataItemMap)"
            }).catch(function (error) {
                ctx.reply(`👎 Error retrieving plant status`)
            })
    })
}

async function loadCurrentStatus(fusionsolar: FusionSolar, ctx: TelegrafContext) {
    ctx.reply("⏳ Loading plants...")
    const userId = ctx.message?.from?.id.toString()

    fusionsolar.getStations(userId)
        .then(async function (response: FusionSolarResponse<Array<Plant>>) {

            const plantsKeyboard = Markup.inlineKeyboard(response.data.map(it =>
                Markup.callbackButton(it.stationName, `plantStatus ${it.stationCode}`))).extra()

            ctx.reply(
                "☀️ Select a plant for loading status",
                plantsKeyboard
            )
        })
        .catch(function (error) {
            ctx.reply("Couldn't retrieve your plants 🤷‍♂️")
        })
}

export default commandStatus

