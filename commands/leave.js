const {
  getVoiceConnection
} = require("@discordjs/voice");

module.exports = {
  name: "leave",
  description: "bot leaves vc",
  async execute(client, message, cmd, args, Discord, queue) {
    try {
      const channel = message.member.voice.channel;
      const connection = getVoiceConnection(channel.guild.id);
      safeExit(queue.get(message.guild.id));
    } catch (error) {
      console.log(error);
      message.channel.send("**An Error occurred!**");
    }
  },
};

const safeExit = (server_queue) => {
  if (!server_queue) return;

  if (server_queue.subscription) {
    server_queue.subscription.unsubscribe();
    server_queue.subscription = null;
  }

  if (server_queue.audio_player) {
    server_queue.audio_player = null;
  }

  if (server_queue.connection) {
    server_queue.connection.destroy();
    server_queue.connection = null;
  }
};