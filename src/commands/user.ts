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

function commandUsername(bot: Telegraf<any>, fusionsolar: FusionSolar) {

    bot.command('username', async (ctx) => {
        ctx.reply("Send me your username please")
    })
}

export default commandUsername

