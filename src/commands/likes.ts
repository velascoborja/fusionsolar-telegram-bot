import { Telegraf } from "telegraf"
import Thingiverse from "../api/thingiverse"
import * as Utils from './../utils'

const ITEMS_PER_PAGE = 3

function commandLikes(bot: Telegraf<any>, thingiverse: Thingiverse) {

    bot.command('likes', (ctx) => {

        const userName = Utils.removeCmd(ctx.message?.text)

        if (userName != '') {
            ctx.reply("⏳ Loading your likes...")

            thingiverse.getLikes(userName)
                .then(async function (things) {
                    if (things.length > 0) {
                        ctx.reply("❤️ These are your likes")

                        for (const element of things) {
                            await ctx.replyWithPhoto(element.thumbnail, { caption: `🏷 ${element.name}\n❤️ ${element.like_count}\n🌐 ${element.public_url}\n` })
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