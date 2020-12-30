const axios = require('axios')
const commandParts = require('telegraf-command-parts')
const { Telegraf, Markup, Router } = require('telegraf')
const dotenv = require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN)

const instance = axios.create({
  baseURL: 'https://api.thingiverse.com/',
  timeout: 10000,
  headers: { 'authorization': `Bearer ${process.env.THINGIVERSE_TOKEN}` }
});

bot.use(commandParts())
bot.start((ctx) => ctx.reply('Welcome!'))
bot.help((ctx) => ctx.reply('Check available options tapping right side button'))

bot.command('likes', (ctx) => {

  ctx.reply("Checking your likes... 👍")

  instance.get(`users/${ctx.state.command.splitArgs[0]}/likes`)
    .then(function (response) {
      response.data.forEach(element => {
        ctx.reply(element.public_url)
      })
    })
    .catch(function (error) {
      return ctx.reply("Couldn't retrieve yout likes 🤷‍♂️")
    })
})

bot.command('collections', (ctx) => {

  ctx.reply("Checking your collections... 📚")

  // Make a request for a user with a given ID
  instance.get(`users/${ctx.state.command.splitArgs[0]}/collections`)
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


/* const inlineMessageRatingKeyboard = Markup.inlineKeyboard([
  Markup.callbackButton('👍', 'like'),
  Markup.callbackButton('👎', 'dislike')
]).extra()

bot.on('message', (ctx) => ctx.telegram.sendMessage(
  ctx.from.id,
  'Like?',
  inlineMessageRatingKeyboard)
)

bot.action('like', (ctx) => ctx.editMessageText('🎉 Awesome! 🎉'))
bot.action('dislike', (ctx) => ctx.editMessageText('okey')) */

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