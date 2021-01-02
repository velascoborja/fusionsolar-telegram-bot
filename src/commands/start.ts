import { Telegraf } from "telegraf"

function commandStart(bot: Telegraf<any>) {
    bot.start((ctx) => ctx.reply('Welcome! Type / to check what this bot can do for you'))
}

export default commandStart