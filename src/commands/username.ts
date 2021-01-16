import { Markup, Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import DatabaseDataSource from "../datasource/db/DatabaseDataSource"
import { User } from "../models/user"
import { getSetUsernameMessage } from "./messages"

function commandUsername(bot: Telegraf<any>, database: DatabaseDataSource) {

    bot.action("setUserName", (ctx: TelegrafContext) => {
        initSetUserNameProcess(ctx)
    })

    bot.command("username", function (ctx: TelegrafContext) {
        initSetUserNameProcess(ctx)
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
        }
    })
}

function initSetUserNameProcess(ctx: TelegrafContext) {
    ctx.reply(getSetUsernameMessage(), Markup.forceReply().extra())
}

export default commandUsername