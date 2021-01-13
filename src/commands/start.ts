import { Telegraf } from "telegraf"

function commandStart(bot: Telegraf<any>) {
    bot.start((ctx) => ctx.reply("Welcome! 🥳\n\nTo get to know what this bot can do for you type / to check all the available commands. ⌨️\n\nIf you wan't you can send me right now your Thingiverse username so that you don't have to manually type it for each command 👌"))
}

export default commandStart