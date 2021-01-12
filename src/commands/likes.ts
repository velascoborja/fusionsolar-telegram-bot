import { Markup, Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import Thingiverse from "../api/thingiverse"
import { ITEMS_PER_PAGE } from "../const"
import { thingToMessage } from "../messages"
import * as Utils from './../utils'

function commandLikes(bot: Telegraf<any>, thingiverse: Thingiverse) {

    bot.command('likes', (ctx) => {
        const userName = Utils.removeCmd(ctx.message?.text)

        if (userName != '') {
            loadLikes(thingiverse, ctx, userName, 0)
        } else ctx.reply("Username was not specified 🤭")
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
                const pages = Utils.slice(things, ITEMS_PER_PAGE)
                const currentPage = pages[pageToLoad]        

                if (currentPage == undefined || currentPage.length < ITEMS_PER_PAGE || pages.length < pageToLoad + 1) {
                    ctx.reply("✅ Those where all your likes")
                } else {
                    ctx.reply("❤️ These are your likes")

                    for (const element of currentPage) {
                        await ctx.replyWithPhoto(
                            element.thumbnail, {
                            caption: thingToMessage(element)
                        })
                    }

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