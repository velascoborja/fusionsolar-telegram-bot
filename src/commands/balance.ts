import { Markup, Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import FusionSolar from "../datasource/api/fusionsolar"
import { Plant } from "../models/plant"
import { PlantDailyBalance } from "../models/plantDailyBalance"

function commandBalance(bot: Telegraf<any>, fusionsolar: FusionSolar) {

    bot.command('dailyBalance', async (ctx) => {
        loadUserDailyBalance(fusionsolar, ctx)
    })

    bot.action(/plantDailyBalance (.+)/, async (ctx) => {
        ctx.reply("⏳ Loading plant balance...")
        const userId = ctx.from?.id.toString()

        const plantId = ctx.match[1]

        getPlantDailyBalance(plantId, userId, ctx)
    })

    async function loadUserDailyBalance(fusionsolar: FusionSolar, ctx: TelegrafContext) {
        ctx.reply("⏳ Loading...")
        const userId = ctx.message?.from?.id.toString()

        fusionsolar.getStations(userId)
            .then(async function (plants: Array<Plant>) {

                // If there are more than 1 plant available, first ask to choose a plant
                if (plants.length > 1) {
                    const plantsKeyboard = Markup.inlineKeyboard(plants.map(it =>
                        Markup.callbackButton(it.stationName, `plantDailyBalance ${it.stationCode}`))).extra()

                    ctx.reply(
                        "☀️ Select a plant for loading daily balance",
                        plantsKeyboard
                    )
                } else {
                    // If only one plant, just show its info
                    let plantId = plants[0].stationCode
                    getPlantDailyBalance(plantId, userId, ctx)
                }
            })
            .catch(function (error) {
                ctx.reply("Couldn't retrieve your plants 🤷‍♂️")
            })
    }

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

