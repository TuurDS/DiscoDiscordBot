module.exports = {
  name: "ping",
  description: "this is a ping command!",
  execute(client, message, cmd, args, Discord) {
    try {
      message.channel.send("Pinging...").then((m) => {
        var ping = m.createdTimestamp - message.createdTimestamp;
        m.edit(`**:ping_pong: Pong! Your Ping Is:-** ${ping}ms`);
      });
    } catch (error) {
      console.log(error);
      message.channel.send("**An Error occurred!**");
    }
  },
};