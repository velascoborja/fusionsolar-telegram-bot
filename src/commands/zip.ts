import { Telegraf } from "telegraf"
import Thingiverse from "../api/thingiverse"

function commandZip(bot: Telegraf<any>, thingiverse: Thingiverse) {
    bot.hears(/\/zip_(.+)/, (ctx) => {

        const thingId = ctx.match[1]
        ctx.reply("📦 Here's your zip:\nhttps://www.thingiverse.com/thing:763622/zip")
    })
}

export default commandZip