import { Telegraf } from "telegraf"

function commandHelp(bot: Telegraf<any>) {
    bot.help((ctx) => ctx.reply("🧐 To get to know what this bot can do for you type / to check all the available commands."))
}

export default commandHelp