import { Markup, Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import Thingiverse from "../api/thingiverse"
import { ITEMS_PER_PAGE } from "../const"
import { thingToMessage } from "../messages"
import * as Utils from '../utils'

function commandMakes(bot: Telegraf<any>, thingiverse: Thingiverse) {

    bot.command('makes', (ctx) => {

        const userName = Utils.removeCmd(ctx.message?.text)

        if (userName != '') {
            ctx.reply("⏳ Loading your makes...")

            loadMakes(thingiverse, userName, ctx, 0)
        } else ctx.reply("Username was not specified 🤭")
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
                const pages = Utils.slice(makes, ITEMS_PER_PAGE)
                const currentPage = pages[pageToLoad]

                if (currentPage == undefined || currentPage.length < ITEMS_PER_PAGE || pages.length < pageToLoad + 1) {
                    ctx.reply("✅ Those where all your makes")
                } else {
                    ctx.reply("🖌 These are your makes:")

                    for (const make of currentPage) {
                        await ctx.replyWithPhoto(make.thumbnail, {
                            caption: `🏷 ${make.thing.name}\n🌐 ${make.public_url}`
                        })
                    }

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