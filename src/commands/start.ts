import { Markup, Telegraf } from "telegraf"
import { Analytics, AnalyticsEvent, AnalyticsParam } from "../analytics/analytics"
import { createSetUsernameButton } from "./messages"

function commandStart(bot: Telegraf<any>, analytics: Analytics) {
    const setUsernameButton = createSetUsernameButton()

    bot.start((ctx) => {
        analytics.logEvent(AnalyticsEvent.COMMAND_START)
        
        ctx.reply("Welcome! 🥳\n\nTo get to know what this bot can do for you type / and take a look to all the available commands. ⌨️\n\nIf you want you can send me right now your Thingiverse username so that you don't have to manually type it for each command 👌",
            setUsernameButton)
    })
}

export default commandStart