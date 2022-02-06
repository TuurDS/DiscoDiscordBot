const {
  sendMessage
} = require("../functions/functions");
module.exports = {
  name: "repeat",
  description: "toggles repeating the music queue!",
  async execute(client, message, cmd, args, Discord, queue) {
    try {
      const voice_channel = message.member.voice.channel;
      if (!voice_channel)
        return sendMessage(message.channel, "You need to be in a channel to execute this command!");

      let server_queue = queue.get(message.guild.id);

      if (!server_queue) {
        const queue_constructor = {
          voice_channel: voice_channel,
          text_channel: message.channel,
          connection: null,
          audio_player: null,
          subscription: null,
          repeat: false,
          currentSong: 0,
          currentOffset: 0,
          videoErrors: 0,
          nowplaying: null,
          previousMessage: null,
          songs: [],
        };
        queue.set(message.guild.id, queue_constructor);
      }

      server_queue = queue.get(message.guild.id);

      if (!server_queue.repeat) {
        server_queue.repeat = true;
        sendMessage(message.channel, "repeating **enabled**", "GREEN");
      } else {
        server_queue.repeat = false;
        sendMessage(message.channel, "repeating **disabled**", "GREEN");
      }
    } catch (error) {
      console.log(error);
      sendMessage(message.channel, "**an error occurred!**");
    }
  },
};