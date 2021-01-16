import { rejects } from "assert"
import { Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import { Analytics, AnalyticsEvent } from "../analytics/analytics"
import Thingiverse from "../datasource/api/thingiverse"
import { Zip } from "../models/zip"

function commandZip(bot: Telegraf<any>, thingiverse: Thingiverse, analytics: Analytics) {

    bot.hears(/\/zip_(.+)/, async (ctx) => {
        analytics.logEvent(AnalyticsEvent.COMMAND_ZIP)

        const thingId = ctx.match[1]
        await ctx.reply("📦 Here's your zip:")
        await ctx.replyWithDocument(`https://www.thingiverse.com/thing:${thingId}/zip`)
            .catch(function (error) {

                /* If ZIP fails try to retrieve package URL and if it keeps failing, just send the URL */
                thingiverse.getPublicZipUrlForThing(thingId)
                    .then(function (url: Zip) {
                        ctx.replyWithDocument(url.public_url)
                            .catch(function (error) {
                                sendThingZipUrl(ctx, thingId)
                            })
                    })
                    .catch(function (error) {
                        sendThingZipUrl(ctx, thingId)
                    })
            })
    })
}

function sendThingZipUrl(ctx: TelegrafContext, thingId: string) {
    ctx.reply(`⬇️ https://www.thingiverse.com/thing:${thingId}/zip`)
}

export default commandZip