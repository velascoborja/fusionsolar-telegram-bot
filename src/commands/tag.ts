import { Markup, Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import Thingiverse from "../datasource/api/fusionsolar"
import { ITEMS_PER_PAGE } from "./const"
import { thingToMessage } from "./messages"
import { Thing } from "../models/station"
import { getUserId, removeCmd, slice } from "./utils"
import { EventHelper, Event, EventParam } from "../analytics/analytics"

function commandTag(bot: Telegraf<any>, thingiverse: Thingiverse, analytics: EventHelper) {
    bot.command('tag', function (ctx: TelegrafContext) {
        const tag = removeCmd(ctx.message.text).split(" ")[0]
        
        analytics.logEvent(Event.COMMAND_TAGS, getUserId(ctx), new Map().set(EventParam.PARAM_TAG, tag))

        if (tag != "") {
            loadTagThings(ctx, tag, thingiverse, 0)
        } else {
            ctx.reply(`🚨 No tag was specified`)
        }
    })

    bot.action(/loadMoreTags (.+)/, (ctx: TelegrafContext) => {
        const args = ctx.match[1]
        const pageToLoad = Number(args.split(" ")[0])
        const tag = args.split(" ")[1]
        loadTagThings(ctx, tag, thingiverse, pageToLoad)
    })
}

export default commandTag

function loadTagThings(ctx: TelegrafContext, tag: string, thingiverse: Thingiverse, pageToLoad: number) {
    ctx.reply(`🔎 Searching things with tag "${tag}"...`)

    thingiverse.searchThingsByTag(tag)
        .then(async function (things: Array<Thing>) {
            if (things.length > 0) {

                /* Retrieve pages */
                const pages = slice(things, ITEMS_PER_PAGE)
                const currentPage = pages[pageToLoad]

                /* Show things */
                await ctx.reply("🏷 These are the things I've found:")
                for (const element of currentPage) {
                    await ctx.replyWithPhoto(element.preview_image, { caption: thingToMessage(element) })
                }

                /* Show load more button if necessary */
                if (pages[pageToLoad + 1] == undefined || currentPage.length < ITEMS_PER_PAGE || pages.length < pageToLoad + 1) {
                    ctx.reply("✅ That was everything I found")
                } else {
                    const loadMoreButton = Markup.inlineKeyboard([
                        [Markup.callbackButton('Load more!', `loadMoreTags ${pageToLoad + 1} ${tag}`)]
                    ]).extra()

                    ctx.reply("🙋 Do you want to load more items?", loadMoreButton)
                }
            } else
                ctx.reply(`0️⃣ Couldn't find anything for tag ${tag}`)
        })
        .catch(function (error) {
            ctx.reply(`0️⃣ Couldn't find anything for tag ${tag}`)
        })
}
