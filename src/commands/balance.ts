import { Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import FusionSolar from "../datasource/api/fusionsolar"
import { PlantDailyBalance } from "../models/plantDailyBalance"
import { selectPlant } from "./plantSelector"

function commandBalance(bot: Telegraf<any>, fusionsolar: FusionSolar) {

    bot.command('dailybalance', async (ctx) => {
        ctx.reply("⏳ Loading...")
        selectPlant(fusionsolar, ctx, 'plantDailyBalance', '☀️ Select a plant for loading daily balance',
            (plantId, userId) => getPlantDailyBalance(plantId, userId, ctx))
    })

    bot.action(/plantDailyBalance (.+)/, async (ctx) => {
        ctx.reply("⏳ Loading plant balance...")
        const userId = ctx.from?.id.toString()
        const plantId = ctx.match[1]
        getPlantDailyBalance(plantId, userId, ctx)
    })

    function getPlantDailyBalance(plantId: string, userId: string, ctx: TelegrafContext) {
        fusionsolar.getPlantDailyKpi(plantId, userId).then(function (balance) {
            showCurrentBalance(ctx, balance)
        }).catch(function (error) {
            ctx.reply("Error retrieving current daily balance 😢")
        })
    }

    function showCurrentBalance(ctx: TelegrafContext, balance: PlantDailyBalance) {
        ctx.reply(`⚡️ Imported ${balance.imported} kwh\n💰 Exported ${balance.exported} kWh`)
    }
}

export default commandBalance
