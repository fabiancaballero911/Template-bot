const express = require('express')
const app = express()
 
app.get('/', function (req, res) {
  res.send('Bot funcionando ⚙️ ✅')
})
 let port = process.env.PORT || 3000;
app.listen(port)
 
require('dotenv').config()

///////////////////////EMPIEZA/TU/BOT//////////////////////////////

const Discord = require('discord.js');

const client = new Discord.Client({ ws: { intents: 32767 } });

require('events').EventEmitter.defaultMaxListeners = 100;




const fs = require('fs');
const ytdl = require('ytdl-core');

const { token, default_prefix } = require('./config.json');

const { readdirSync } = require('fs');

const { join } = require('path');

const config = require('./config.json');
client.config = config;

const db = require('quick.db');

const Canvas = require('canvas');

require("./ExtendedMessage");




client.commands = new Discord.Collection();

//You can change the prefix if you like. It doesn't have to be ! or ;
fs.readdirSync("./commands").forEach(folder => {
  const commandFiles = fs.readdirSync(`./commands/${folder}/`).filter(f => f.endsWith(".js"));
  for (file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  };
});



client.on('error', e => console.error(e));
client.on('warn', e => console.warn(e));

client.on('ready', async () => {
  console.log('The client is ready!')

  

  client.user.setPresence({
		activity: {
			name: `;help | Estoy en ${
				client.guilds.cache.size
			} servidores, genial no?.`,
			type: 'WATCHING'
		},
		status: 'idle'
	});


})


client.on("message", async message => {

    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;

    let prefix = await db.get(`prefix_${message.guild.id}`);
    if (prefix === null) prefix = default_prefix;

    const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);

    if(!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);


        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);

        const command = args.shift().toLowerCase();
        const cmd = client.commands.find((c) => c.name == command || c.aliases && c.aliases.includes(command));

        if(!cmd) return;


        try {
            cmd.run(client, message, args);

        } catch (error) {
            console.error(error);
        }
})


client.login(token);