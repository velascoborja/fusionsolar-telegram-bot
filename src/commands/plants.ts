import { Markup, Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import FusionSolar from "../datasource/api/fusionsolar"
import { FusionSolarResponse } from "../datasource/api/models/response"
import DatabaseDataSource from "../datasource/db/DatabaseDataSource"
import { Plant } from "../models/plant"

function commandPlants(bot: Telegraf<any>, fusionsolar: FusionSolar) {

    bot.command('plants', async (ctx) => {
        loadPlants(fusionsolar, ctx)
    })

    bot.command('plantRealTime', async (ctx) => {
        loadPlantRealTime(fusionsolar, ctx)
    })

    bot.action(/plant (.+)/, async (ctx) => {
        ctx.reply("⏳ Loading plant real status...")
        
        const userId = ctx.from?.id.toString()
        const plantId = ctx.match[1]

        fusionsolar.getDevicesForPlantId(plantId, userId).then(function (response) {
            loadPlantDevices(fusionsolar, ctx, response.data)
        }).catch(function (error) {
            ctx.reply(`👎 Error retrieving your devices: ${error}`)
        })
    })
}

async function loadPlants(fusionsolar: FusionSolar, ctx: TelegrafContext) {
    ctx.reply("⏳ Loading plants...")
    const userId = ctx.from?.id.toString()

    fusionsolar.getStations(userId)
        .then(async function (response: FusionSolarResponse<Array<Plant>>) {
            ctx.reply("☀️ These are your plants")
            response.data.forEach(function (value, index) {
                ctx.reply(`${Plant.toMessage(value)}\n\n`)
            })
        })
        .catch(function (error) {
            ctx.reply("Couldn't retrieve yout plants 🤷‍♂️")
        })
}

async function loadPlantRealTime(fusionsolar: FusionSolar, ctx: TelegrafContext) {
    ctx.reply("⏳ Loading available plants...")
    const userId = ctx.from?.id.toString()

    fusionsolar.getStations(userId)
        .then(async function (response: FusionSolarResponse<Array<Plant>>) {
            const plantsKeyboard = Markup.inlineKeyboard(response.data.map(it =>
                Markup.callbackButton(it.stationName, `plant ${it.stationCode}`))).extra()

            ctx.reply(
                "☀️ Select a plant for retrieving real time status",
                plantsKeyboard
            )
        })
        .catch(function (error) {
            ctx.reply("Couldn't retrieve yout plants 🤷‍♂️")
        })
}

export default commandPlants