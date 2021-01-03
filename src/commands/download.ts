import { Telegraf } from "telegraf"
import Thingiverse from "../api/thingiverse"

function commandDownload(bot: Telegraf<any>, thingiverse: Thingiverse) {
    bot.hears(/\/dl_(.+)/, (ctx) => {
        ctx.reply("⬇️ Downloading thing...")

        const thingId = ctx.match[1]

        thingiverse.getThingUrl(thingId)
            .then(function (url) {
                ctx.replyWithDocument(url.public_url.replace(" ", "_"))
            })
            .catch(function (error) {
                ctx.reply("Couldn't download files 🤷‍♂️")
            })
    })
}

export default commandDownload