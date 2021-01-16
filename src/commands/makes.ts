import { Markup, Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import { EventHelper, Event } from "../analytics/analytics"
import Thingiverse from "../datasource/api/thingiverse"
import DatabaseDataSource from "../datasource/db/DatabaseDataSource"
import { ITEMS_PER_PAGE } from "./const"
import { sendDefaultUsernameNotProvidedMessage, thingToMessage } from "./messages"
import * as Utils from './utils'

function commandMakes(bot: Telegraf<any>, thingiverse: Thingiverse, db: DatabaseDataSource, analytics: EventHelper) {

    bot.command('makes', async (ctx) => {
        analytics.logEvent(Event.COMMAND_MAKES)
        const username = await Utils.getUsername(db, ctx.message.text, ctx.message?.from?.id.toString())
        
        if (username != '') {
            ctx.reply("⏳ Loading your makes...")

            loadMakes(thingiverse, username, ctx, 0)
        } else sendDefaultUsernameNotProvidedMessage(ctx)
    })

    bot.action(/loadMoreMakes (.+)/, (ctx: TelegrafContext) => {
        const args = ctx.match[1]
        const pageToLoad = Number(args.split(" ")[0])
        const userName = args.split(" ")[1]
        loadMakes(thingiverse, userName, ctx, pageToLoad)
    })
}

function loadMakes(thingiverse: Thingiverse, userName: string, ctx: TelegrafContext, pageToLoad: number) {
    thingiverse.getUserMakes(userName)
        .then(async function (makes) {
            if (makes.length > 0) {

                /* Retrieve pages */
                const pages = Utils.slice(makes, ITEMS_PER_PAGE)
                const currentPage = pages[pageToLoad]

                /* Show makes */
                await ctx.reply("🖌 These are your makes:")
                for (const make of currentPage) {
                    await ctx.replyWithPhoto(make.thumbnail, {
                        caption: `🏷 ${make.thing.name}\n🌐 ${make.public_url}`
                    })
                }

                if (pages[pageToLoad + 1] == undefined || currentPage.length < ITEMS_PER_PAGE || pages.length < pageToLoad + 1) {
                    ctx.reply("✅ Those where all your makes")
                } else {
                    const loadMoreButton = Markup.inlineKeyboard([
                        [Markup.callbackButton('Load more!', `loadMoreMakes ${pageToLoad + 1} ${userName}`)]
                    ]).extra()

                    ctx.reply("🙋 Do you want to load more makes?", loadMoreButton)
                }
            } else
                ctx.reply("0️⃣ No makes were found")
        })
        .catch(function (error) {
            ctx.reply("Couldn't retrieve yout makes 🤷‍♂️")
        })
}

export default commandMakes