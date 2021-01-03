import { Extra, Markup, Telegraf } from "telegraf"
import Thingiverse from "../api/thingiverse"
import { thingToMessage } from "../messages"
import { Collection } from "../models/collection"
import * as Utils from './../utils'

function commandCollections(bot: Telegraf<any>, thingiverse: Thingiverse) {

    bot.command('collections', (ctx) => {
        ctx.reply("⏳ Loading your collections...")

        const username = Utils.removeCmd(ctx.message?.text)
        const rows = 2

        if (username != '') {
            thingiverse.getUserCollections(username)
                .then(function (collections) {
                    if (collections.length > 0) {
                        const collectionArrays = []

                        for (var i = 0; i < collections.length; i += rows) {
                            collectionArrays.push(collections.slice(i, i + rows));
                        }

                        const collectionsKeyboard = Markup.inlineKeyboard(collectionArrays.map(it =>
                            it.map((it: { name: string; id: string; }) => Markup.callbackButton(it.name, `collection ${it.id}`))
                        )).extra()

                        ctx.reply(
                            "📚 These are your colletions",
                            collectionsKeyboard
                        )
                    } else ctx.reply("0️⃣ No collections were found")
                })
                .catch(function (error) {
                    ctx.reply("Couldn't retrieve your collections 🤷‍♂️")
                })
        } else ctx.reply("Username was not specified 🤭")
    })

    bot.action(/collection (.+)/, async (ctx) => {
        ctx.reply("⏳ Loading your things...")

        const collectionId = ctx.match[1]
        const collectionName = (await thingiverse.getCollectionForId(collectionId))?.name || ''

        thingiverse.getItemsForCollection(collectionId)
            .then(async function (things) {
                if (things.length > 0) {
                    ctx.reply(`📚 Things from "${collectionName}" collection:`)

                    for (const element of things) {
                        await ctx.replyWithPhoto(element.preview_image, { caption: thingToMessage(element) })
                    }

                    ctx.reply("🏁 That's all!")
                } else ctx.reply("0️⃣ No things were found")
            })
            .catch(function (error) {
                ctx.reply("Couldn't retrieve things for this collection 🤷‍♂️")
            })
    })
}

export default commandCollections