import { Telegraf } from "telegraf"
import { EventHelper, Event } from "../analytics/analytics"
import Thingiverse from "../datasource/api/fusionsolar"
import { getUserId } from "./utils"

function commandFiles(bot: Telegraf<any>, thingiverse: Thingiverse, analytics: EventHelper) {

    bot.hears(/\/files_(.+)/, (ctx) => {
        analytics.logEvent(Event.COMMAND_FILES, getUserId(ctx))

        ctx.reply("⏳ Retrieving files...")

        const thingId = ctx.match[1]

        thingiverse.getFiles(thingId)
            .then(async function (files) {
                let filesMessage = ""

                for (const file of files) {
                    filesMessage += `🏷 ${file.name}\n🏋️ ${file.formatted_size}\n⬇️ Downloads: ${file.download_count}\n📥 Download: ${file.public_url}`
                    filesMessage += "\n\n"
                }

                ctx.reply(filesMessage)
            })
            .catch(function (error) {
                ctx.reply("Couldn't retrieve files 🤷‍♂️")
            })
    })
}

export default commandFiles