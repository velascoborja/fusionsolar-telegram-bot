import { Telegraf, Markup } from 'telegraf'
import * as dotenv from 'dotenv'
import FusionSolar from './datasource/api/fusionsolar'

import commandPlants from './commands/plants'
import DatabaseDataSource from './datasource/db/DatabaseDataSource'
import commandDevices from './commands/devices'
import commandStatus from './commands/status'
import commandUsername from './commands/user'

dotenv.config()

new DatabaseDataSource().init('mongodb://localhost:27017', 'fusionsolarbot')
    .then(function (databaseDataSource) {
        initTelegraf(databaseDataSource)
        console.log("Bot started successfully")
    })
    .catch(function (err) {
        console.log("Error starting bot")
        console.log(err)
    })

function initTelegraf(databaseDataSource: DatabaseDataSource) {

    const bot = new Telegraf(process.env.BOT_TOKEN || '')
    const fusionSolar = new FusionSolar(databaseDataSource)

    commandUsername(bot, fusionSolar)
    commandPlants(bot, fusionSolar)
    commandDevices(bot, fusionSolar)
    commandStatus(bot, fusionSolar)

    bot.launch()
}