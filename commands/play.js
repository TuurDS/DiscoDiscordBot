const {
  video_player,
  safeExit,
  sendMessage
} = require("../functions/functions");

module.exports = {
  name: "play",
  aliases: ["p"],
  cooldown: 0,
  description: "this command will play a song!",
  async execute(client, message, cmd, args) {



    try {
      //FLAGS
      const voice_channel = message.member.voice.channel;
      if (!voice_channel) return sendMessage(message.channel, "You need to be in a channel to execute this command!");
      const permissions = voice_channel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT")) return sendMessage(message.channel, "You dont have the correct permissions");
      if (!permissions.has("SPEAK")) return sendMessage(message.channel, "You dont have the correct permissions");
      if (!args.length) return sendMessage(message.channel, "You need to send a second argument!");

      //CODE
      const queue = client.player.getQueue(message.guild.id) || client.player.createQueue(message.guild.id);

      await queue.join(message.member.voice.channel);
      let song = await queue.play(args.join(' ')).catch(err => {
          console.log(err);
          queue.stop();
      });

      sendMessage(message.channel, `👍 **[${song.title}](${song.url})** added to queue!`, "GREEN");
      queue.setData({
        channel: message.channel
      });

      //log all the data of the song
      console.log("author: %s", song?.author);
      console.log("data: %s", song?.data);
      console.log("duration: %s", song?.duration);
      console.log("isFirst: %s", song?.isFirst);
      console.log("isLive: %s", song?.isLive);
      console.log("milliseconds: %s", song?.milliseconds);
      console.log("name: %s", song?.name);
      console.log("player: %s", song?.player);
      console.log("thumbnail: %s", song?.thumbnail);
      console.log("queue: %s", song?.queue);
      console.log("requestedBy: %s", song?.requestedBy);
      console.log("seekTime: %s", song?.seekTime);
      console.log("url: %s", song?.url);
    
    } catch (error) {
      console.log(error);
      sendMessage(message.channel, "**an error occurred!**");
    }
  },
};