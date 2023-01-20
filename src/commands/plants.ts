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
}

async function loadPlants(fusionsolar: FusionSolar, ctx: TelegrafContext) {
    ctx.reply("⏳ Loading plants...")
    const userId = ctx.message?.from?.id.toString()

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

export default commandPlants