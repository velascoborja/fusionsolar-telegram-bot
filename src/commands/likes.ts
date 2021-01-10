import { Extra, Markup, Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import { isGetAccessor } from "typescript"
import Thingiverse from "../api/thingiverse"
import { thingToMessage } from "../messages"
import { Thing } from "../models/thing"
import * as Utils from './../utils'

const ITEMS_PER_PAGE = 3

function commandLikes(bot: Telegraf<any>, thingiverse: Thingiverse) {

    bot.command('likes', (ctx) => {

        const userName = Utils.removeCmd(ctx.message?.text)

        if (userName != '') {
            loadLikes(thingiverse, ctx, userName, 0)
        } else ctx.reply("Username was not specified 🤭")
    })

    bot.action(/like (.+)/, (ctx: TelegrafContext) => {
        const args = ctx.match[1]
        const pageToLoad = Number(args.split(" ")[0])
        const userName = args.split(" ")[1]
        loadLikes(thingiverse, ctx, userName, pageToLoad)
    })
}

function loadLikes(thingiverse: Thingiverse, ctx: TelegrafContext, userName: string, page: number) {
    ctx.reply("⏳ Loading your likes...")

    thingiverse.getUserLikes(userName)
        .then(async function (things) {
            if (things.length > 0) {
                ctx.reply("❤️ These are your likes")

                const pages = Utils.slice(things, ITEMS_PER_PAGE)
                const currentPage = pages[page]

                for (let index = 0; index < currentPage.length; index++) {
                    const element = currentPage[index];

                    await ctx.replyWithPhoto(
                        element.thumbnail, {
                        caption: thingToMessage(element)
                    })
                }

                if (currentPage.length < ITEMS_PER_PAGE) {
                    ctx.reply("✅ Those where all your likes")
                } else {
                    const loadMoreButton = Markup.inlineKeyboard([
                        [Markup.callbackButton('➕ Load more!', `like ${page + 1} ${userName}`)]
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