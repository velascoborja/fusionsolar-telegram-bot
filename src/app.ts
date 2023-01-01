import { Telegraf, Markup } from 'telegraf'
import * as dotenv from 'dotenv'
import FusionSolar from './datasource/api/fusionsolar'

import commandLikes from './commands/likes'

dotenv.config()


    initTelegraf()
    console.log("Bot started successfully")


function initTelegraf() {

    const bot = new Telegraf(process.env.BOT_TOKEN || '')
    const thingiverse = new FusionSolar(process.env.FUSIONSOLAR_TOKEN)

    commandLikes(bot, thingiverse)

    bot.launch()
}