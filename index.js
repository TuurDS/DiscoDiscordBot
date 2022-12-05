const Discord = require("discord.js");
require('dotenv').config();
try {
  const myIntents = new Discord.Intents();
  myIntents.add(
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES
  );

  const client = new Discord.Client({
    intents: myIntents,
  });

  client.commands = new Discord.Collection();
  client.events = new Discord.Collection();

  ["command_handler", "event_handler"].forEach((e) => {
    require(`./handlers/${e}`)(client, Discord);
  });
  const test = process.env;

  client.login(process.env.DISCORD_TOKEN);
} catch (error) {
  console.log(error);
}