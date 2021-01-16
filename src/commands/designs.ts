import { Markup, Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import Thingiverse from "../datasource/api/thingiverse"
import DatabaseDataSource from "../datasource/db/DatabaseDataSource"
import { ITEMS_PER_PAGE } from "./const"
import { sendDefaultUsernameNotProvidedMessage, thingToMessage } from "./messages"
import * as Utils from "./utils"

function commandDesigns(bot: Telegraf<any>, thingiverse: Thingiverse, db: DatabaseDataSource) {
    bot.command("designs", async (ctx) => {
        ctx.reply("⏳ Retrieving designs...")

        const username = await Utils.getUsername(db, ctx.message.text, ctx.message?.from?.id.toString())

        if (username != '') {
            loadDesigns(thingiverse, username, ctx, 0)
        } else sendDefaultUsernameNotProvidedMessage(ctx)
    })

    bot.action(/loadMoreDesigns (.+)/, async (ctx: TelegrafContext) => {
        const args = ctx.match[1]
        const pageToLoad = Number(args.split(" ")[0])
        const username = args.split(" ")[1]

        loadDesigns(thingiverse, username, ctx, pageToLoad)
    })
}

function loadDesigns(thingiverse: Thingiverse, username: string, ctx: TelegrafContext, pageToLoad: number) {
    thingiverse.getUsersDesigns(username)
        .then(async function (designs) {
            if (designs.length > 0) {

                /* Retrieve pages */
                const pages = Utils.slice(designs, ITEMS_PER_PAGE)
                const currentPage = pages[pageToLoad]

                /* Show designs */
                await ctx.reply("🎨 These are your designs")
                for (const element of currentPage) {
                    await ctx.replyWithPhoto(element.thumbnail, { caption: thingToMessage(element) })
                }

                /* Show load more button */
                if (pages[pageToLoad + 1] == undefined || currentPage.length < ITEMS_PER_PAGE || pages.length < pageToLoad + 1) {
                    ctx.reply("✅ Those where all your designs")
                } else {
                    const loadMoreButton = Markup.inlineKeyboard([
                        [Markup.callbackButton('Load more!', `loadMoreDesigns ${pageToLoad + 1} ${username}`)]
                    ]).extra()

                    ctx.reply("🙋 Do you want to load more items?", loadMoreButton)
                }
            } else
                ctx.reply("0️⃣ No designs were found")
        })
        .catch(function (error) {
            ctx.reply("Couldn't retrieve yout designs 🤷‍♂️")
        })
}

export default commandDesigns
