module.exports = {
  name: "repeat",
  description: "toggles repeating the music queue!",
  async execute(client, message, cmd, args, Discord, queue) {
    try {
      const voice_channel = message.member.voice.channel;
      if (!voice_channel)
        return message.channel.send("You need to be in a channel to execute this command!");

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
          songs: [],
        };
        queue.set(message.guild.id, queue_constructor);
      }

      server_queue = queue.get(message.guild.id);

      if (!server_queue.repeat) {
        server_queue.repeat = true;
        message.channel.send("repeating enabled!");
      } else {
        server_queue.repeat = false;
        message.channel.send("repeating disabled!");
      }
    } catch (error) {
      console.log(error);
      message.channel.send("**An Error occurred!**");
    }
  },
};