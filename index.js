const { parsed: env } = require('dotenv').load()
const schedule = require('node-schedule')
const Discord = require('discord.js')
const client = new Discord.Client()
const fetch = require('node-fetch')
const moment = require('moment')

moment.locale('ja')

let now = moment()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  update()
})

client.on('guildCreate', guild => {
  const today = now.format('L')
  guild.me.setNickname(today)
})

schedule.scheduleJob('0 0 * * *', () => update())

async function update() {
  now = moment()
  const today = now.format('L');
  client.guilds.forEach(guild => guild.me.setNickname(today))
  client.user.setPresence({ game: { name: await getDetails() } })
}

async function getDetails() {
  const today = now.format('YYYY-MM-DD')
  const day = now.toDate().getDay()
  const res = await fetch('https://holidays-jp.github.io/api/v1/date.json')
  const json = await res.json()
  const type = json[today] ? '祝日' : [0, 6].includes(day) ? '休日' : '平日'
  return now.format(`dddd ${type} ${(json[today] || '')}`)
}

client.login(env.TOKEN)

process.on('unhandledRejection', err => console.log(err))
