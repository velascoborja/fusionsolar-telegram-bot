import { Telegraf } from "telegraf"
import { Analytics, AnalyticsEvent } from "../analytics/analytics"

function commandHelp(bot: Telegraf<any>, analytics: Analytics) {
    bot.help((ctx) => {
        analytics.logEvent(AnalyticsEvent.COMMAND_HELP)
        ctx.reply("🧐 To get to know what this bot can do for you type / to check all the available commands.")
    })
}

export default commandHelp