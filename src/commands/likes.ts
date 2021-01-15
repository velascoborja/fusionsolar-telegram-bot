import { Markup, Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import Thingiverse from "../datasource/api/thingiverse"
import DatabaseDataSource from "../datasource/db/DatabaseDataSource"
import { ITEMS_PER_PAGE } from "./const"
import { sendDefaultUsernameNotProvidedMessage, thingToMessage } from "./messages"
import * as Utils from './utils'

function commandLikes(bot: Telegraf<any>, thingiverse: Thingiverse, db: DatabaseDataSource) {

    bot.command('likes', async (ctx) => {
        const username = await Utils.getUsername(db, ctx.message.text, ctx.message?.from?.id.toString())

        if (username != '') {
            loadLikes(thingiverse, ctx, username, 0)
        } else sendDefaultUsernameNotProvidedMessage(ctx)
    })

    bot.action(/loadMoreLikes (.+)/, (ctx: TelegrafContext) => {
        const args = ctx.match[1]
        const pageToLoad = Number(args.split(" ")[0])
        const userName = args.split(" ")[1]
        loadLikes(thingiverse, ctx, userName, pageToLoad)
    })
}

function loadLikes(thingiverse: Thingiverse, ctx: TelegrafContext, userName: string, pageToLoad: number) {
    ctx.reply("⏳ Loading your likes...")

    thingiverse.getUserLikes(userName)
        .then(async function (things) {
            if (things.length > 0) {

                /* Retrieve pages */
                const pages = Utils.slice(things, ITEMS_PER_PAGE)
                const currentPage = pages[pageToLoad]

                /* Show likes */
                await ctx.reply("❤️ These are your likes")
                for (const element of currentPage) {
                    await ctx.replyWithPhoto(
                        element.thumbnail, {
                        caption: thingToMessage(element)
                    })
                }

                /* Show load button if necessary */
                if (pages[pageToLoad + 1] == undefined || currentPage.length < ITEMS_PER_PAGE || pages.length < pageToLoad + 1) {
                    ctx.reply("✅ Those where all your likes")
                } else {
                    const loadMoreButton = Markup.inlineKeyboard([
                        [Markup.callbackButton('Load more!', `loadMoreLikes ${pageToLoad + 1} ${userName}`)]
                    ]).extra()

                    ctx.reply("🙋 Do you want to load more items?", loadMoreButton)
                }

            } else ctx.reply("0️⃣ No likes were found")
        })
        .catch(function (error) {
            ctx.reply("Couldn't retrieve yout likes 🤷‍♂️")
        })
}

export default commandLikes