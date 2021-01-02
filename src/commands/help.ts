import { Telegraf } from "telegraf"

function commandHelp(bot: Telegraf<any>) {
    bot.help((ctx) => ctx.reply('Type / to check what this bot can do for you'))
}

export default commandHelp