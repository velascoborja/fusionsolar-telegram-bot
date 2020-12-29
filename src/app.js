const axios = require('axios')
const commandParts = require('telegraf-command-parts')
const { Telegraf } = require('telegraf')
const dotenv = require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN)

const instance = axios.create({
  baseURL: 'https://api.thingiverse.com/',
  timeout: 1000,
  headers: { 'authorization': `Bearer ${process.env.THINGIVERSE_TOKEN}` }
});

bot.use(commandParts())
bot.start((ctx) => ctx.reply('Welcome!'))
bot.help((ctx) => ctx.reply('Check available options tapping right side button'))

bot.command('likes', (ctx) => {

  ctx.reply("Checking your likes... 👍")

  // Make a request for a user with a given ID
  instance.get(`users/${ctx.state.command.splitArgs[0]}/likes`)
    .then(function (response) {
      response.data.forEach(element => {
          ctx.replyWithPhoto(element.preview_image)
      })
    })
    .catch(function (error) {
      return ctx.reply("Couldn't retrieve yout likes 😔")
    })
})

bot.launch()