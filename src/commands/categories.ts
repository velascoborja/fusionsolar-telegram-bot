import { Extra, Markup, Telegraf } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import Thingiverse from "../datasource/api/fusionsolar"
import { ITEMS_PER_PAGE } from "./const"
import { sendDefaultUsernameNotProvidedMessage, thingToMessage } from "./messages"
import { Collection } from "../models/collection"
import * as Utils from './utils'
import DatabaseDataSource from "../datasource/db/DatabaseDataSource"
import { User } from "../models/user"
import { EventHelper, Event } from "../analytics/analytics"
import { Category } from "../models/category"

const ROW_COUNT = 3

function commandCategories(bot: Telegraf<any>, thingiverse: Thingiverse, db: DatabaseDataSource, analytics: EventHelper) {
    bot.command('categories', async (ctx: TelegrafContext) => {
        analytics.logEvent(Event.COMMAND_CATEGORIES, Utils.getUserId(ctx))

        ctx.reply("⏳ Loading categories...")
        thingiverse.getCategories()
            .then(function (categories: Array<Category>) {
                if (categories.length > 0) {
                    const categoriesArrays = []

                    for (var i = 0; i < categories.length; i += ROW_COUNT) {
                        categoriesArrays.push(categories.slice(i, i + ROW_COUNT));
                    }

                    const categoriesKeyboard = Markup.inlineKeyboard(categoriesArrays.map(it =>
                        it.map((it: { name: string; id: string; }) => Markup.callbackButton(it.name, `category ${it.id}`))
                    )).extra()

                    ctx.reply(
                        "🗂 These are the available categories:",
                        categoriesKeyboard
                    )
                } else ctx.reply("0️⃣ No categories were found")
            })
            .catch(function (error) {
                ctx.reply("Couldn't retrieve available categories 🤷‍♂️")
            })
    })

    bot.action(/category (.+)/, async (ctx) => {
        ctx.reply("⏳ Loading sub categories...")

       /*  const categoryId = ctx.match[1]
        const collection = await thingiverse.getCategoryForId(categoryId)

        loadSubCategories(thingiverse, ctx, collection, 0) */
    })

    bot.action(/loadMoreCategories (.+)/, async (ctx: TelegrafContext) => {
        /* const args = ctx.match[1]
        const pageToLoad = Number(args.split(" ")[0])

        const collectionId = args.split(" ")[1]
        const collection = await thingiverse.getCollectionForId(collectionId)

        loadSubCategories(thingiverse, ctx, collection, pageToLoad) */
    })
}

function loadSubCategories(thingiverse: Thingiverse, ctx: TelegrafContext, collection: Collection, pageToLoad: number) {
/*     thingiverse.getItemsForCollection(collection.id.toString())
        .then(async function (things) {
            if (things.length > 0) {

                // Retrieve pages
                const pages = Utils.slice(things, ITEMS_PER_PAGE)
                const currentPage = pages[pageToLoad]

                // Show things
                await ctx.reply(`📚 "${collection.name || ''}" collection\n🌐 Web: ${collection.absolute_url}`, { disable_web_page_preview: true })
                await ctx.reply("🎨 Things:")
                for (const element of currentPage) {
                    await ctx.replyWithPhoto(element.preview_image, { caption: thingToMessage(element) })
                }

                // Show load more button if needed
                if (pages[pageToLoad + 1] == undefined || currentPage.length < ITEMS_PER_PAGE || pages.length < pageToLoad + 1) {
                    ctx.reply("✅ No more items in collection")
                } else {
                    const loadMoreButton = Markup.inlineKeyboard([
                        [Markup.callbackButton('Load more!', `loadMoreCategories ${pageToLoad + 1} ${collection.id}`)]
                    ]).extra()

                    ctx.reply("🙋 Do you want to load more items?", loadMoreButton)
                }
            } else ctx.reply("0️⃣ No items were found")
        })
        .catch(function (error) {
            ctx.reply("Couldn't retrieve things for this collection 🤷‍♂️")
        }) */
}

export default commandCategories