import { Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import Thingiverse from "../api/thingiverse"
import { thingToMessage } from "../messages"
import { Hits } from "../models/hits"
import { Thing } from "../models/thing"
import { removeCmd } from "../utils"

function commandSearch(bot: Telegraf<any>, thingiverse: Thingiverse) {
    bot.command('search', function (ctx: TelegrafContext) {
        const search = removeCmd(ctx.message.text)

        ctx.reply(`🔎 Searching things for "${search}"...`)

        thingiverse.searchThings(search)
            .then(async function (hits: Hits) {
                if (hits.hits.length > 0) {
                    ctx.reply("🎨 These are the things I've found:")

                    for (let index = 0; index < 5; index++) {
                        const element = hits.hits[index];

                        await ctx.replyWithPhoto(element.preview_image, { caption: thingToMessage(element) })
                    }

                    ctx.reply("🏁 That's all!")
                } else ctx.reply(`0️⃣ Couldn't find anything for ${search}`)
            })
            .catch(function (error) {
                ctx.reply(`0️⃣ Couldn't find anything for ${search}`)
            })
    })
}

export default commandSearch