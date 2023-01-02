import { Markup, Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import FusionSolar from "../datasource/api/fusionsolar"

function commandStatus(bot: Telegraf<any>, thingiverse: FusionSolar) {

    bot.command('status', async (ctx) => {
        loadStatus(thingiverse, ctx)
    })
}

function loadStatus(fusionsolar: FusionSolar, ctx: TelegrafContext) {
    ctx.reply("⏳ Loading plant status...")

    fusionsolar.getStations()
        .then(async function (things) {
            ctx.reply("Station list")
        })
        .catch(function (error) {
            ctx.reply("Couldn't retrieve yout likes 🤷‍♂️")
        })
}

export default commandStatus