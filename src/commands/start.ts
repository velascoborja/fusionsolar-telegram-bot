import { Markup, Telegraf } from "telegraf"
import { createSetUsernameButton } from "./messages"

function commandStart(bot: Telegraf<any>) {
    const setUsernameButton = createSetUsernameButton()

    bot.start((ctx) => ctx.reply("Welcome! 🥳\n\nTo get to know what this bot can do for you type / and take a look to all the available commands. ⌨️\n\nIf you want you can send me right now your Thingiverse username so that you don't have to manually type it for each command 👌",
        setUsernameButton))
}

export default commandStart