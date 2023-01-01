import { Markup, Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import Thingiverse from "../datasource/api/fusionsolar"
import { ITEMS_PER_PAGE } from "./const"
import { thingToMessage } from "./messages"
import { Hits } from "../models/hits"
import { getUserId, removeCmd, slice } from "./utils"
import { EventHelper, Event, EventParam } from "../analytics/analytics"
import { Thing } from "../models/station"

function commandPopular(bot: Telegraf<any>, thingiverse: Thingiverse, analytics: EventHelper) {
    bot.command('popular', function (ctx: TelegrafContext) {
        analytics.logEvent(Event.COMMAND_POPULAR, getUserId(ctx))
        loadPopular(ctx, thingiverse, 0)
    })

    bot.action(/morePopular (.+)/, (ctx: TelegrafContext) => {
        const args = ctx.match[1]
        const pageToLoad = Number(args.split(" ")[0])
        loadPopular(ctx, thingiverse, pageToLoad)
    })
}

export default commandPopular

function loadPopular(ctx: TelegrafContext, thingiverse: Thingiverse, pageToLoad: number) {
    ctx.reply(`🦄 Searching popular things...`)

    thingiverse.getPopularThings()
        .then(async function (result: Hits) {
            if (result.hits.length > 0) {

                /* Retrieve pages */
                const pages = slice(result.hits, ITEMS_PER_PAGE)
                const currentPage = pages[pageToLoad]

                /* Show things */
                await ctx.reply("🎨 These are popular things right now:")
                for (const element of currentPage) {
                    await ctx.replyWithPhoto(element.preview_image, { caption: thingToMessage(element) })
                }

                /* Show load more button if necessary */
                if (pages[pageToLoad + 1] == undefined || currentPage.length < ITEMS_PER_PAGE || pages.length < pageToLoad + 1) {
                    ctx.reply("✅ That was everything I found")
                } else {
                    const loadMoreButton = Markup.inlineKeyboard([
                        [Markup.callbackButton('Load more!', `morePopular ${pageToLoad + 1}`)]
                    ]).extra()

                    ctx.reply("🙋 Do you want to load more items?", loadMoreButton)
                }
            } else {
                ctx.reply(`0️⃣ Couldn't find anything popular right now`)
            }
        })
        .catch(function (error) {
            ctx.reply(`0️⃣ Couldn't find anything popular right now`)
        })
}
