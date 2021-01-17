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
import { EventHelper, Event } from './analytics/analytics'
import commandPopular from './commands/popular'
import commandCategories from './commands/categories'

dotenv.config()

new DatabaseDataSource().init('mongodb://localhost:27017', 'thingiversemakerbot')
    .then(function (databaseDataSource) {
        const analytics = initAnalytics(databaseDataSource)
        initTelegraf(databaseDataSource, analytics)
        console.log("Bot started successfully")
    })
    .catch(function (err) {
        console.log("Error starting bot")
    })

function initTelegraf(dataBase: DatabaseDataSource, analytics: EventHelper) {

    const bot = new Telegraf(process.env.BOT_TOKEN || '')
    const thingiverse = new Thingiverse(process.env.THINGIVERSE_TOKEN)

    commandStart(bot, analytics, dataBase)
    commandCategories(bot, thingiverse, dataBase, analytics)
    commandHelp(bot, analytics)
    commandLikes(bot, thingiverse, dataBase, analytics)
    commandCollections(bot, thingiverse, dataBase, analytics)
    commandDesigns(bot, thingiverse, dataBase, analytics)
    commandMakes(bot, thingiverse, dataBase, analytics)
    commandFiles(bot, thingiverse, analytics)
    commandZip(bot, thingiverse, analytics)
    commandTag(bot, thingiverse, analytics)
    commandSearch(bot, thingiverse, analytics)
    commandPopular(bot, thingiverse, analytics)
    commandUsername(bot, dataBase, analytics)

    bot.launch()
}

function initAnalytics(db : DatabaseDataSource): EventHelper {
    const eventHelper = new EventHelper(db)
    eventHelper.logEvent(Event.APP_START)
    return eventHelper
}