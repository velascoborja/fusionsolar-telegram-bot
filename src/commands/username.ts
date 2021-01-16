import { Markup, Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import { Analytics, AnalyticsEvent } from "../analytics/analytics"
import DatabaseDataSource from "../datasource/db/DatabaseDataSource"
import { User } from "../models/user"
import { getSetUsernameMessage } from "./messages"

function commandUsername(bot: Telegraf<any>, database: DatabaseDataSource, analytics: Analytics) {

    bot.action("setUserName", (ctx: TelegrafContext) => {
        initSetUserNameProcess(ctx, analytics)
    })

    bot.command("username", function (ctx: TelegrafContext) {
        initSetUserNameProcess(ctx, analytics)
    })

    bot.on("message", function (ctx: TelegrafContext) {
        if (ctx.message.reply_to_message != undefined && ctx.message.reply_to_message.text == getSetUsernameMessage()) {
            const thingiverseUsername = ctx.message.text
            const username = ctx.message.from.username || ""
            const userId = ctx.message.from.id.toString()

            if (thingiverseUsername == undefined || thingiverseUsername == "") {
                ctx.reply("📭 Username cannot be empty")
            } else {
                database.insertOrUpdateUser(new User(userId, username, thingiverseUsername))
                .then(function (result) {
                    ctx.reply(`✅ Username "${thingiverseUsername}" was correctly saved.\n\nFrom now on you can execute commands without specifing a username and the one you just set will be used`)
                })
                .catch(function (error) {
                    ctx.reply("❌ Couldn't set your username")
                })
            }
        } else {
            ctx.reply("🙀 I can't understand what you're trying to tell me. Maybe you could try to type / and take a look to all available commands")
        }
    })
}

function initSetUserNameProcess(ctx: TelegrafContext, analytics: Analytics) {
    analytics.logEvent(AnalyticsEvent.COMMAND_USERNAME)
    
    ctx.reply(getSetUsernameMessage(), Markup.forceReply().extra())
}

export default commandUsername