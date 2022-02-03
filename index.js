try {
  const Discord = require("discord.js");

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

  client.login("OTM2MTYzNTMwMjUwNTIyNjQ1.YfJMOg.blLSkFsmxDLQk1e918vofaa-2Lk");
} catch (error) {
  console.log(error);
}
