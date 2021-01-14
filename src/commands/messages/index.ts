import Telegraf, { Markup } from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { Thing } from "../../models/thing";

export function thingToMessage(thing: Thing): string {
    return `🏷 ${thing.name}\n❤️ ${thing.like_count}\n🌐 ${thing.public_url}\n📂 Files: /dl_${thing.id}\n⬇️ Download ZIP: /zip_${thing.id}`
}

export function getSetUsernameMessage(): string {
    return 'Now send me your Thingiverse username 🧑‍💻'
}

export function sendDefaultUsernameNotProvidedMessage(ctx: TelegrafContext) {
    const setUsernameButton = createSetUsernameButton()

    ctx.reply("Username was not specified 🤭\n\nIf you want to, you can specify a default username by typing /username or touching the button below",
        setUsernameButton)
}

export function createSetUsernameButton() {
    return Markup.inlineKeyboard([
        [Markup.callbackButton('Set username', 'setUserName')]
    ]).extra();
}
