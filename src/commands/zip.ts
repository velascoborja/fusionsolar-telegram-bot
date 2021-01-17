import { rejects } from "assert"
import { Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import { EventHelper, Event, EventParam } from "../analytics/analytics"
import Thingiverse from "../datasource/api/thingiverse"
import { Zip } from "../models/zip"
import { getUserId } from "./utils"

function commandZip(bot: Telegraf<any>, thingiverse: Thingiverse, analytics: EventHelper) {

    bot.hears(/\/zip_(.+)/, async (ctx) => {
        const thingId = ctx.match[1]

        analytics.logEvent(Event.COMMAND_ZIP, getUserId(ctx), new Map().set(EventParam.PARAM_THING_ID, thingId))

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