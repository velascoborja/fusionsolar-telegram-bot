import { Telegraf } from 'telegraf'
import * as dotenv from 'dotenv'
import FusionSolar from './datasource/api/fusionsolar'

import commandPlants from './commands/plants'
import DatabaseDataSource from './datasource/db/DatabaseDataSource'
import commandDevices from './commands/devices'
import commandStatus from './commands/status'
import commandBalance from './commands/balance'
import commandUsername from './commands/user'

dotenv.config()

if (!process.env.BOT_TOKEN) {
    throw new Error("BOT_TOKEN environment variable is required")
}
if (!process.env.MONGO_URL || !process.env.MONGO_DB) {
    throw new Error("MONGO_URL and MONGO_DB environment variables are required")
}

new DatabaseDataSource().init(process.env.MONGO_URL, process.env.MONGO_DB)
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
    commandBalance(bot, fusionSolar)

    bot.launch()
}