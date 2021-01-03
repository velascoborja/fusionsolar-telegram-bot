import { Telegraf } from "telegraf"
import Thingiverse from "../api/thingiverse"
import { thingToMessage } from "../messages"
import * as Utils from './../utils'

const ITEMS_PER_PAGE = 3

function commandLikes(bot: Telegraf<any>, thingiverse: Thingiverse) {

    bot.command('likes', (ctx) => {

        const userName = Utils.removeCmd(ctx.message?.text)

        if (userName != '') {
            ctx.reply("⏳ Loading your likes...")

            thingiverse.getUserLikes(userName)
                .then(async function (things) {
                    if (things.length > 0) {
                        ctx.reply("❤️ These are your likes")

                        for (const element of things) {
                            await ctx.replyWithPhoto(element.thumbnail, { caption: thingToMessage(element) })
                        }

                        ctx.reply("🏁 That's all!")
                    } else ctx.reply("0️⃣ No likes were found")
                })
                .catch(function (error) {
                    ctx.reply("Couldn't retrieve yout likes 🤷‍♂️")
                })
        } else ctx.reply("Username was not specified 🤭")
    })

}

export default commandLikes