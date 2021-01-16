import { Telegraf, Markup } from 'telegraf'
import * as dotenv from 'dotenv'
import Thingiverse from './datasource/api/thingiverse'

import * as firebase from "firebase/app"
import * as analytics from 'firebase/analytics'

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
import { Analytics, AnalyticsEvent } from './analytics/analytics'

dotenv.config()

new DatabaseDataSource().init('mongodb://localhost:27017', 'thingiversemakerbot')
    .then(function (databaseDataSource) {
        console.log("MongoDb started successfully")
        const analytics = initFirebase()
        initTelegraf(databaseDataSource, analytics)
    })
    .catch(function (err) {
        console.log("Couldn't start MongoDb")
    })

function initTelegraf(dataBase: DatabaseDataSource, analytics: Analytics) {

    const bot = new Telegraf(process.env.BOT_TOKEN || '')
    const thingiverse = new Thingiverse(process.env.THINGIVERSE_TOKEN)

    commandStart(bot, analytics)
    commandHelp(bot, analytics)
    commandLikes(bot, thingiverse, dataBase, analytics)
    commandCollections(bot, thingiverse, dataBase, analytics)
    commandDesigns(bot, thingiverse, dataBase, analytics)
    commandMakes(bot, thingiverse, dataBase, analytics)
    commandFiles(bot, thingiverse, analytics)
    commandZip(bot, thingiverse, analytics)
    commandTag(bot, thingiverse, analytics)
    commandSearch(bot, thingiverse, analytics)
    commandUsername(bot, dataBase, analytics)

    bot.launch()
}

function initFirebase(): Analytics {
    const firebaseConfig = process.env.FIREBASE_CONFIG
    firebase.default.initializeApp(firebaseConfig)
    const analytics = new Analytics()
    analytics.logEvent(AnalyticsEvent.APP_START)
    return analytics
}