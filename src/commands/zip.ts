import { Telegraf } from "telegraf"
import Thingiverse from "../api/thingiverse"

function commandZip(bot: Telegraf<any>, thingiverse: Thingiverse) {
    bot.hears(/\/zip_(.+)/, (ctx) => {

        const thingId = ctx.match[1]
        ctx.reply("📦 Here's your zip:")
        try {
            ctx.replyWithDocument(`https://www.thingiverse.com/thing:${thingId}/zip`) 
        } catch (error) {
            const s = ""
        }
    })
}

export default commandZip