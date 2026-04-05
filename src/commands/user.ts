import { Telegraf } from "telegraf"
import FusionSolar from "../datasource/api/fusionsolar"

function commandUsername(bot: Telegraf<any>, fusionsolar: FusionSolar) {

    bot.command('username', async (ctx) => {
        ctx.reply("Send me your username please")
    })
}

export default commandUsername
