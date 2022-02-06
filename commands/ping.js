const {
  sendMessage
} = require("../functions/functions");
module.exports = {
  name: "ping",
  description: "this is a ping command!",
  execute(client, message, cmd, args, Discord) {
    try {
      let embed1 = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setDescription("Pinging...")

      message.channel.send({
        embeds: [embed1],
      }).then((m) => {
        var ping = m.createdTimestamp - message.createdTimestamp;
        let embed2 = new Discord.MessageEmbed()
          .setColor("GREEN")
          .setDescription(`:ping_pong: Pong! Your Ping Is:- **${ping}ms**`)
        m.edit({
          embeds: [embed2],
        });
      });
    } catch (error) {
      console.log(error);
      sendMessage(message.channel, "**an error occurred!**");
    }
  },
};