import { Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import FusionSolar from "../datasource/api/fusionsolar"
import { Status } from "../models/status"
import { selectPlant } from "./plantSelector"

function commandStatus(bot: Telegraf<any>, fusionsolar: FusionSolar) {

    bot.command('status', async (ctx) => {
        ctx.reply("⏳ Loading...")
        selectPlant(fusionsolar, ctx, 'plantStatus', '☀️ Select a plant for loading status',
            (plantId, userId) => getPlantStatus(plantId, userId, ctx))
    })

    bot.action(/plantStatus (.+)/, async (ctx) => {
        ctx.reply("⏳ Loading plant status...")
        const userId = ctx.from?.id.toString()
        const plantId = ctx.match[1]
        getPlantStatus(plantId, userId, ctx)
    })

    function getPlantStatus(plantId: string, userId: string, ctx: TelegrafContext) {
        fusionsolar.getStatus(plantId, userId).then(function (result) {
            showCurrentStatus(ctx, result)
        }).catch(function (error) {
            ctx.reply("Error retrieving current status 😢")
        })
    }

    function showCurrentStatus(ctx: TelegrafContext, status: Status) {
        let solarYieldIndicator = status.instantPowerConsumption > 0 ? "☀️" : "🌙"
        let importExportIndicator = status.instantPowerConsumption > 0 ? "🟢" : "🔴"
        let currentHouseLoad = Math.round((Math.abs((status.instantSolarYield * 1000) - status.instantPowerConsumption) / 1000) * 100) / 100

        ctx.reply("🏠 This is your status:")
        ctx.reply(`
        ${solarYieldIndicator} Solar power: ${status.instantSolarYield} kW\n🔌 House load: ${currentHouseLoad} kW\n${importExportIndicator} Grid import/export: ${status.instantPowerConsumption / 1000} kW\n🏭 Day yield: ${status.dailyYield} kWh`)
    }
}

export default commandStatus
