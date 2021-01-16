import { Extra, Markup, Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import Thingiverse from "../datasource/api/thingiverse"
import { ITEMS_PER_PAGE } from "./const"
import { sendDefaultUsernameNotProvidedMessage, thingToMessage } from "./messages"
import { Collection } from "../models/collection"
import * as Utils from './utils'
import DatabaseDataSource from "../datasource/db/DatabaseDataSource"
import { User } from "../models/user"
import { Analytics, AnalyticsEvent } from "../analytics/analytics"

const ROW_COUNT = 3

function commandCollections(bot: Telegraf<any>, thingiverse: Thingiverse, db: DatabaseDataSource, analytics: Analytics) {
    bot.command('collections', async (ctx: TelegrafContext) => {
        analytics.logEvent(AnalyticsEvent.COMMAND_COLLECTIONS)
        
        const username = await Utils.getUsername(db, ctx.message?.text, ctx.message?.from?.id.toString())

        if (username != '') {
            ctx.reply("⏳ Loading your collections...")
            thingiverse.getUserCollections(username)
                .then(function (collections) {
                    if (collections.length > 0) {
                        const collectionArrays = []

                        for (var i = 0; i < collections.length; i += ROW_COUNT) {
                            collectionArrays.push(collections.slice(i, i + ROW_COUNT));
                        }

                        const collectionsKeyboard = Markup.inlineKeyboard(collectionArrays.map(it =>
                            it.map((it: { name: string; id: string; }) => Markup.callbackButton(it.name, `collection ${it.id}`))
                        )).extra()

                        ctx.reply(
                            "📚 These are your collections",
                            collectionsKeyboard
                        )
                    } else ctx.reply("0️⃣ No collections were found")
                })
                .catch(function (error) {
                    ctx.reply("Couldn't retrieve your collections 🤷‍♂️")
                })
        } else sendDefaultUsernameNotProvidedMessage(ctx)
    })

    bot.action(/collection (.+)/, async (ctx) => {
        ctx.reply("⏳ Loading your collection...")

        const collectionId = ctx.match[1]
        const collection = await thingiverse.getCollectionForId(collectionId)

        loadCollectionItems(thingiverse, ctx, collection, 0)
    })

    bot.action(/loadMoreItems (.+)/, async (ctx: TelegrafContext) => {
        const args = ctx.match[1]
        const pageToLoad = Number(args.split(" ")[0])

        const collectionId = args.split(" ")[1]
        const collection = await thingiverse.getCollectionForId(collectionId)

        loadCollectionItems(thingiverse, ctx, collection, pageToLoad)
    })
}

function loadCollectionItems(thingiverse: Thingiverse, ctx: TelegrafContext, collection: Collection, pageToLoad: number) {
    thingiverse.getItemsForCollection(collection.id.toString())
        .then(async function (things) {
            if (things.length > 0) {

                /* Retrieve pages */
                const pages = Utils.slice(things, ITEMS_PER_PAGE)
                const currentPage = pages[pageToLoad]

                /* Show things */
                await ctx.reply(`📚 "${collection.name || ''}" collection\n🌐 Web: ${collection.absolute_url}`, { disable_web_page_preview: true })
                await ctx.reply("🎨 Things:")
                for (const element of currentPage) {
                    await ctx.replyWithPhoto(element.preview_image, { caption: thingToMessage(element) })
                }

                /* Show load more button if needed */
                if (pages[pageToLoad + 1] == undefined || currentPage.length < ITEMS_PER_PAGE || pages.length < pageToLoad + 1) {
                    ctx.reply("✅ No more items in collection")
                } else {
                    const loadMoreButton = Markup.inlineKeyboard([
                        [Markup.callbackButton('Load more!', `loadMoreItems ${pageToLoad + 1} ${collection.id}`)]
                    ]).extra()

                    ctx.reply("🙋 Do you want to load more items?", loadMoreButton)
                }
            } else ctx.reply("0️⃣ No items were found")
        })
        .catch(function (error) {
            ctx.reply("Couldn't retrieve things for this collection 🤷‍♂️")
        })
}

export default commandCollections