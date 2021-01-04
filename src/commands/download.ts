import { Telegraf } from "telegraf"
import Thingiverse from "../api/thingiverse"

function commandDownload(bot: Telegraf<any>, thingiverse: Thingiverse) {
    bot.hears(/\/dl_(.+)/, (ctx) => {
        ctx.reply("⏳ Retrieving files...")

        const thingId = ctx.match[1]

        thingiverse.getFiles(thingId)
            .then(async function (files) {
                for (const file of files) {
                    const bigSizePreview = file.default_image?.sizes?.find(element => element.type == 'display' && element.size == 'large')
                    const photo = bigSizePreview && bigSizePreview || file.thumbnail
                    await ctx.replyWithPhoto(photo, { caption: `🏷 ${file.name}\n🏋️ ${file.formatted_size}\n⬇️ Downloads: ${file.download_count}\n📥 Download: ${file.public_url}` })
                }
            })
            .catch(function (error) {
                ctx.reply("Couldn't retrieve files 🤷‍♂️")
            })
    })
}

export default commandDownload