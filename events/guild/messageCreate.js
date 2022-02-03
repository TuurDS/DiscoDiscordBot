const queue = new Map();

module.exports = (client, Discord, message) => {
  try {
    const prefix = "?";
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(" ");
    const cmd = args.shift().toLowerCase();

    const command =
      client.commands.get(cmd) ||
      client.commands.find((e) => e.aliases && e.aliases.includes(cmd));

    if (command) command.execute(client, message, cmd, args, Discord, queue);
    else message.reply("This command does not exist!");
  } catch (error) {
    console.log(error);
    message.channel.send("**An Error occurred!**");
  }
};
