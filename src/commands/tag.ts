import { Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import Thingiverse from "../api/thingiverse"
import { thingToMessage } from "../messages"
import { Thing } from "../models/thing"
import { removeCmd } from "../utils"

function commandTag(bot: Telegraf<any>, thingiverse: Thingiverse) {
    bot.command('tag', function (ctx: TelegrafContext) {
        const tag = removeCmd(ctx.message.text).split(" ")[0]

        ctx.reply(`🔎 Searching things with tag "${tag}"...`)

        thingiverse.searchThingsByTag(tag)
            .then(async function (things: Array<Thing>) {
                if (things.length > 0) {
                    ctx.reply("🏷 These are the things I've found:")

                    for (let index = 0; index < 5; index++) {
                        const element = things[index];

                        await ctx.replyWithPhoto(element.preview_image, { caption: thingToMessage(element) })
                    }

                    ctx.reply("🏁 That's all!")
                } else ctx.reply(`0️⃣ Couldn't find anything for tag ${tag}`)
            })
            .catch(function (error) {
                ctx.reply(`0️⃣ Couldn't find anything for tag ${tag}`)
            })
    })
}

export default commandTag