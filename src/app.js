import { Telegraf, Markup } from 'telegraf'
import commandParts from 'telegraf-command-parts'

const axios = require('axios').default()
const dotenv = require('dotenv').config()

const thingiverse = axios.create({
  baseURL: 'https://api.thingiverse.com/',
  timeout: 10000,
  headers: { 'authorization': `Bearer ${process.env.THINGIVERSE_TOKEN}` }
});

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.use(commandParts())
bot.start((ctx) => ctx.reply('Welcome!'))
bot.help((ctx) => ctx.reply('Check available options tapping right side button'))

/* - Gets likes from selected user --- */
bot.command('likes', (ctx) => {

  ctx.reply("Checking your likes... 👍")

  thingiverse.get(`users/${ctx.state.command.splitArgs[0]}/likes`)
    .then(function (response) {
      response.data.forEach(element => {
        ctx.reply(element.public_url)
      })
    })
    .catch(function (error) {
      return ctx.reply("Couldn't retrieve yout likes 🤷‍♂️")
    })
})

/* --- Gets all collections from selected user --- */
bot.command('collections', (ctx) => {

  ctx.reply("Checking your collections... 📚")

  // Make a request for a user with a given ID
  thingiverse.get(`users/${ctx.state.command.splitArgs[0]}/collections`)
    .then(function (response) {
      /*       response.data.forEach(element =>
              ctx.reply(element.absolute_url)
            ) */

      const collections = Markup.inlineKeyboard(response.data.map(it =>
        Markup.callbackButton(it.name, it.id)
      )).extra()

      return ctx.reply(
        'Like?',
        collections
      )
    })
    .catch(function (error) {
      return ctx.reply("Couldn't retrieve yout collections 🤷‍♂️")
    })
})

bot.command('random', (ctx) => {
  ctx.reply('random example',
    Markup.inlineKeyboard([
      [Markup.callbackButton('Plain', 'plain')],
      [Markup.callbackButton('Plain', 'plain')],
      [Markup.callbackButton('Plain', 'plain')],
      [Markup.callbackButton('Plain', 'plain')],
    ]).extra()
  )
})

bot.launch()