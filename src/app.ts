import { Telegraf, Markup } from 'telegraf'
import * as dotenv from 'dotenv'
import Thingiverse from './datasource/api/thingiverse'

import commandLikes from './commands/likes'
import commandCollections from './commands/collections'
import commandStart from './commands/start'
import commandHelp from './commands/help'
import commandDesigns from './commands/designs'
import commandFiles from './commands/files'
import commandZip from './commands/zip'
import commandTag from './commands/tag'
import commandSearch from './commands/search'
import commandMakes from './commands/makes'
import DatabaseDataSource from './datasource/db/DatabaseDataSource'
import commandUsername from './commands/username'

dotenv.config()

new DatabaseDataSource().init('mongodb://localhost:27017', 'thingiversemakerbot')
    .then(function (databaseDataSource) {
        console.log("MongoDb started successfully")
        initTelegraf(databaseDataSource)
    })
    .catch(function (err) {
        console.log("Couldn't start MongoDb")
    })

function initTelegraf(dataBase: DatabaseDataSource) {

    const bot = new Telegraf(process.env.BOT_TOKEN || '')
    const thingiverse = new Thingiverse(process.env.THINGIVERSE_TOKEN)
    
    commandStart(bot)
    commandHelp(bot)
    commandLikes(bot, thingiverse)
    commandCollections(bot, thingiverse, dataBase)
    commandDesigns(bot, thingiverse)
    commandFiles(bot, thingiverse)
    commandZip(bot, thingiverse)
    commandTag(bot, thingiverse)
    commandSearch(bot, thingiverse)
    commandMakes(bot, thingiverse)
    commandUsername(bot, dataBase)
    
    bot.launch()
}