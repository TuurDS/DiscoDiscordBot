const {
  video_player,
  sendMessage
} = require("../functions/functions");

module.exports = {
  name: "fastforward",
  aliases: ["ff"],
  description: "fastforwards a specific amount of time!",
  async execute(client, message, cmd, args) {
    try {
      const voice_channel = message.member.voice.channel;
      if (!voice_channel) return sendMessage(message.channel, "You need to be in a channel to execute this command!");

      const queue = client.player.getQueue(message.guild.id) || client.player.createQueue(message.guild.id);
      const nowPlaying = queue.nowPlaying;

      if (!nowPlaying) return sendMessage(message.channel, "**There is no song to fast forward!**");
      if (!args[0]) return sendMessage(message.channel, "please enter an amount you want to fastforward!");
      if (isNaN(args[0])) return sendMessage(message.channel, "please enter a valid number!");
      if (args[0] < 1) return sendMessage(message.channel, `please enter a number greater than **1**`);

      let totalseconds = nowPlaying.milliseconds / 1000;
      let currentseconds = nowPlaying.seekTime;

      //fastforward the song by the amount of seconds, if the amount of seconds is greater than the total amount of seconds, then set the seek time to the total amount of seconds
      
      if (currentseconds + parseInt(args[0]) > totalseconds) {
        queue.seek(totalseconds);
        sendMessage(message.channel, `fastforwarded **${totalseconds - currentseconds}** seconds!`, "GREEN");
      } else {
        queue.seek(currentseconds + parseInt(args[0]));
        sendMessage(message.channel, `fastforwarded **${parseInt(args[0])}** seconds!`, "GREEN");
      }


    } catch (error) {
      console.log(error);
      sendMessage(message.channel, "**an error occurred!**");
    }
  },
};