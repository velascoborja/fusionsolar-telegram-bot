import { stat } from "fs"
import { Markup, Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import FusionSolar from "../datasource/api/fusionsolar"
import { FusionSolarResponse } from "../datasource/api/models/response"
import DatabaseDataSource from "../datasource/db/DatabaseDataSource"
import { Device } from "../models/device"
import { DeviceDataItemMap } from "../models/deviceRealTime"
import { MeterDataItemMap } from "../models/meterRealTime"
import { Plant } from "../models/plant"
import { Status } from "../models/status"

function commandStatus(bot: Telegraf<any>, fusionsolar: FusionSolar) {

    bot.command('status', async (ctx) => {
        loadUserPlants(fusionsolar, ctx)
    })

    bot.action(/plantStatus (.+)/, async (ctx) => {
        ctx.reply("⏳ Loading plant status...")
        const userId = ctx.from?.id.toString()

        const plantId = ctx.match[1]

        getPlantStatus(plantId, userId, ctx)
    })

    async function loadUserPlants(fusionsolar: FusionSolar, ctx: TelegrafContext) {
        ctx.reply("⏳ Loading...")
        const userId = ctx.message?.from?.id.toString()

        fusionsolar.getStations(userId)
            .then(async function (plants: Array<Plant>) {

                // If there are more than 1 plant available, first ask to choose a plant
                if (plants.length > 1) {
                    const plantsKeyboard = Markup.inlineKeyboard(plants.map(it =>
                        Markup.callbackButton(it.stationName, `plantStatus ${it.stationCode}`))).extra()

                    ctx.reply(
                        "☀️ Select a plant for loading status",
                        plantsKeyboard
                    )
                } else {
                    // If only one plant, just show its info
                    let plantId = plants[0].stationCode
                    getPlantStatus(plantId, userId, ctx)
                }
            })
            .catch(function (error) {
                ctx.reply("Couldn't retrieve your plants 🤷‍♂️")
            })
    }

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
        let currentHouseLoad = Math.abs((status.instantSolarYield * 1000) - status.instantPowerConsumption) / 1000

        ctx.reply("🏠 This is your status:")
        ctx.reply(`
        ${solarYieldIndicator} Solar power: ${status.instantSolarYield} kW\n🔌 House load: ${currentHouseLoad} kW\n${importExportIndicator} Grid import/export: ${status.instantPowerConsumption / 1000} kW\n🏭 Day yield: ${status.dailyYield} kWh`)
    }
}

export default commandStatus

