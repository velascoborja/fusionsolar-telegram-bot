import { Markup, Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import Thingiverse from "../datasource/api/thingiverse"
import { ITEMS_PER_PAGE } from "./const"
import { thingToMessage } from "./messages"
import { Hits } from "../models/hits"
import { Thing } from "../models/thing"
import { getUserId, removeCmd, slice } from "./utils"
import { EventHelper, Event } from "../analytics/analytics"

function commandSearch(bot: Telegraf<any>, thingiverse: Thingiverse, analytics: EventHelper) {
    bot.command('search', function (ctx: TelegrafContext) {

        analytics.logEvent(Event.COMMAND_SEARCH, getUserId(ctx))

        const search = removeCmd(ctx.message.text)

        if (search != "") {
            loadSearch(ctx, search, thingiverse, 0)
        } else {
            ctx.reply(`🚨 Nothing to search was specified`)
        }
    })

    bot.action(/searchMore (.+)/, (ctx: TelegrafContext) => {
        const args = ctx.match[1]
        const pageToLoad = Number(args.split(" ")[0])
        const search = args.split(" ")[1]
        loadSearch(ctx, search, thingiverse, pageToLoad)
    })
}

export default commandSearch

function loadSearch(ctx: TelegrafContext, search: string, thingiverse: Thingiverse, pageToLoad: number) {
    ctx.reply(`🔎 Searching things for "${search}"...`)

    thingiverse.searchThings(search)
        .then(async function (result: Hits) {
            if (result.hits.length > 0) {

                /* Retrieve pages */
                const pages = slice(result.hits, ITEMS_PER_PAGE)
                const currentPage = pages[pageToLoad]

                /* Show things */
                await ctx.reply("🎨 These are the things I've found:")
                for (const element of currentPage) {
                    await ctx.replyWithPhoto(element.preview_image, { caption: thingToMessage(element) })
                }

                /* Show load more button if necessary */
                if (pages[pageToLoad + 1] == undefined || currentPage.length < ITEMS_PER_PAGE || pages.length < pageToLoad + 1) {
                    ctx.reply("✅ That was everything I found")
                } else {
                    const loadMoreButton = Markup.inlineKeyboard([
                        [Markup.callbackButton('Load more!', `searchMore ${pageToLoad + 1} ${search}`)]
                    ]).extra()

                    ctx.reply("🙋 Do you want to load more items?", loadMoreButton)
                }
            } else {
                ctx.reply(`0️⃣ Couldn't find anything for ${search}`)
            }
        })
        .catch(function (error) {
            ctx.reply(`0️⃣ Couldn't find anything for ${search}`)
        })
}
