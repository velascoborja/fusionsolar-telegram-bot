import { Markup, Telegraf } from "telegraf"
import Thingiverse from "../api/thingiverse"
import * as Utils from './../utils'

function commandCollections(bot: Telegraf<any>, thingiverse: Thingiverse) {

    bot.command('collections', (ctx) => {
        ctx.reply("⏳ Loading your collections...")

        const username = Utils.removeCmd(ctx.message?.text)
        const rows = 2

        if (username != '') {
            thingiverse.getCollections(username)
                .then(function (collections) {
                    if (collections.length > 0) {
                        const collectionArrays = []

                        for (var i = 0; i < collections.length; i += rows) {
                            collectionArrays.push(collections.slice(i, i + rows));
                        }

                        const collectionsKeyboard = Markup.inlineKeyboard(collectionArrays.map(it =>
                            it.map((it: { name: string; id: string; }) => Markup.callbackButton(it.name, it.id))
                        )).extra()

                        ctx.reply(
                            "📚 These are your colletions",
                            collectionsKeyboard
                        )
                    } else ctx.reply("0️⃣ No collections were found")
                })
                .catch(function (error) {
                    ctx.reply("Couldn't retrieve yout collections 🤷‍♂️")
                })
        } else ctx.reply("Username was not specified 🤭")
    })
}

export default commandCollections