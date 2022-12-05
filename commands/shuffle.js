const {
  sendMessage
} = require("../functions/functions");
module.exports = {
  name: "shuffle",
  aliases: ["sf"],
  description: "shuffles the music queue!",
  async execute(client, message, cmd, args, Discord, queue) {
    try {
      const voice_channel = message.member.voice.channel;
      if (!voice_channel) return sendMessage(message.channel, "You need to be in a channel to execute this command!");

      let server_queue = queue.get(message.guild.id);
      if (!server_queue) return sendMessage(message.channel, "**There are no tracks to be shuffled!**");
      if (!server_queue.songs) return sendMessage(message.channel, "**There are no tracks to be shuffled!**");
      if (server_queue.songs.length < 2) return sendMessage(message.channel, "**There are not enough tracks to be shuffle the queue (min 2)!**");
      shuffle(server_queue.songs);
      return sendMessage(message.channel, "The player has been **shuffled**", "GREEN");
    } catch (error) {
      console.log(error);
      sendMessage(message.channel, "**an error occurred!**");
    }
  },
};

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}