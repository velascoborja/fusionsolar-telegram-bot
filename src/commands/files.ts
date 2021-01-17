import { Telegraf } from "telegraf"
import { EventHelper, Event } from "../analytics/analytics"
import Thingiverse from "../datasource/api/thingiverse"
import { getUserId } from "./utils"

function commandFiles(bot: Telegraf<any>, thingiverse: Thingiverse, analytics: EventHelper) {

    bot.hears(/\/dl_(.+)/, (ctx) => {
        analytics.logEvent(Event.COMMAND_FILES, getUserId(ctx))

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

export default commandFiles