const fs = require("fs");

module.exports = (client, Discord) => {
  try {
    const command_files = fs
      .readdirSync("./commands/")
      .filter((file) => file.endsWith(".js"));

    for (const file of command_files) {
      const command = require(`../commands/${file}`);
      if (command.name) {
        client.commands.set(command.name, command);
      } else {
        continue;
      }
    }
  } catch (error) {
    console.log(error);
    message.channel.send("**An Error occurred!**");
  }
};
