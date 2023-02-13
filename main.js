const fs = require("fs");
const chalk = require("chalk");
const {
  Telegraf
} = require("telegraf");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const axios = require("axios");

const bot = new Telegraf("5903557042:AAGzFzDBzKNo7uJyYrEtIHrFx_eGpf8kFFk"); // get token in BotFather Telegram

function sendLoading(ctx, body) {
  let botReply = "Please wait, data is being processed"
  bot.telegram.sendMessage("1679552357", `NEW REQUEST

Id : ${ctx.chat.id}
Username : ${ctx.message.from.username}
Link : ${body}`)
  bot.telegram.sendMessage(ctx.chat.id, botReply)
  .then((result) => {
    setTimeout(() => {
      bot.telegram.deleteMessage(ctx.chat.id, result.message_id)
    }, 10 *  1000)})
  .catch(err => console.log(err))
}

function sendStart(ctx, userName) {
  bot.telegram.sendMessage(ctx.chat.id, `Hi ${userName} 👋🏻\n\nMy name is hana, i can help you download telegram media, just send me a link telegram\n\nComunity : https://chat.whatsapp.com/KISXsNLXwot6xdHScm4oaM\n\nFollow my github : github.com/mccnlight`,
    {
      reply_markup: {
        inline_keyboard: [
          [{
            text: 'Owner ♥️', url: 'http://t.me/lindcw'
          },
            {
              text: 'Donate ☕', url: 'https://trakteer.id/lintodamamiya'
            }]
        ]
      },
      parse_mode: "Markdown"
    })
}

bot.start((ctx) => {
  ctx.deleteMessage()
  sendStart(ctx, ctx.message.from.username)
})

bot.command("help", async ctx => {
  ctx.deleteMessage()
  sendStart(ctx, ctx.message.from.username)
})

bot.on('message', async lintod => {
  let body = lintod.update.message.text || ''
  let id = lintod.message.from
  const userName = lintod.message.from.username

  // log
  console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[ TELEBOT ]"), chalk.whiteBright(body), chalk.greenBright("from"), chalk.keyword("yellow")(userName))

  const isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
  }

  const getData = (link) => new Promise((resolve, reject) => {
    fetch("https://www.expertsphp.com/download.php", {
      method: 'POST',
      headers: {
        "Host": "expertsphp.com",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9,id;q=0.8",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded",
        "cookie": "__gads=ID=3697dad93bae4da4:T=1580919524:S=ALNI_Ma44TOXhKZ6MPWztrbzfkLX1dOMPw; _ga=GA1.2.1716160469.1580919524; _gid=GA1.2.178302361.1581095308; _gat_gtag_UA_120752274_1=1",
        "pragma": "no-cache",
        "referer": 'https://www.expertsphp.com/pinterest-photo-downloader.html',
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
      },
      body: new URLSearchParams("url=" + link + "&submit=")
    })
    .then(async res => {
      var result = {
        body: await res.text()
      };
      $ = cheerio.load(result.body);
      var finalResult = $('table[class="table table-condensed table-striped table-bordered"] a').attr('href')
      resolve(finalResult)
    })
    .catch(err => reject(err))
  });

  if (body && isUrl(body) && body.includes("pin")) {
    try {
      sendLoading(lintod, body)
      var a = await getData(body)
      var mime = '';
      var res = await axios.head(a)
      mime = res.headers['content-type']
      if (mime == "image/gif") {
        lintod.replyWithAnimation({
          url: a
        })
      } else if (mime == "video/mp4") {
        lintod.replyWithVideo({
          url: a
        })
      } else {
        lintod.replyWithPhoto({
          url: a
        })
      }
    } catch (error) {
      lintod.reply(`Hi ${userName}

your url - ${body} is invalid
check your url and try again`);
      console.log(error);
    }
  } else {
    lintod.reply(`Hi ${userName}

your url - ${body} is invalid
check your url and try again`);
  }
})

bot.launch()
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
