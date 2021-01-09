import { Extra, Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import Thingiverse from "../api/thingiverse"
import { thingToMessage } from "../messages"
import { Thing } from "../models/thing"
import * as Utils from './../utils'

const ITEMS_PER_PAGE = 3

function commandLikes(bot: Telegraf<any>, thingiverse: Thingiverse) {

    bot.command('likes', (ctx) => {

        const userName = Utils.removeCmd(ctx.message?.text)

        if (userName != '') {
            ctx.reply("⏳ Loading your likes...")

            thingiverse.getUserLikes(userName)
                .then(async function (things) {
                    if (things.length > 0) {
                        ctx.reply("❤️ These are your likes")

                        const thingsPages = []

                        for (let i = 0; i < things.length; i += ITEMS_PER_PAGE) {
                            thingsPages.push(things.slice(i, i + ITEMS_PER_PAGE));
                        }

                        sendPage(thingsPages[0], ctx)
                    } else ctx.reply("0️⃣ No likes were found")
                })
                .catch(function (error) {
                    ctx.reply("Couldn't retrieve yout likes 🤷‍♂️")
                })
        } else ctx.reply("Username was not specified 🤭")
    })

}

async function sendPage(things: Array<Thing>, ctx: TelegrafContext) {
    for (let index = 0; index < things.length; index++) {
        const element = things[index];

        const buttons = Extra.markup((m) =>
            m.inlineKeyboard([
                [m.callbackButton('Test', 'test')],
                [m.callbackButton('Test 2', 'test2')]
            ])
        )

        const args = index == things.length -1 && {
            caption: thingToMessage(element),
            reply_markup: buttons.reply_markup
        } || {
            caption: thingToMessage(element)
        } 

        ctx.telegram.sendPhoto(
            ctx.chat.id,
            element.thumbnail,
            args
        )
    }
}

export default commandLikes