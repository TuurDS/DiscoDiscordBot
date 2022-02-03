const format = require("format-duration");

module.exports = {
  name: "queue",
  description: "shows the current queue!",
  async execute(client, message, cmd, args, Discord, queue) {
    try {
      const voice_channel = message.member.voice.channel;
      if (!voice_channel)
        return message.channel.send("You need to be in a channel to execute this command!");
      const server_queue = queue.get(message.guild.id);
      if (!server_queue || server_queue.songs.length < 1) {
        return message.channel.send("**Queue is empty!**");
      }
      if (!args[0]) {
        args[0] = Math.ceil((server_queue.currentSong + 1) / 10);
      }
      if (isNaN(args[0])) return message.reply("please enter a valid number!");
      if (args[0] < 1 || args[0] > Math.ceil(server_queue.songs.length / 10))
        return message.reply(`please enter a number between 1 and ${Math.ceil(server_queue.songs.length / 10)}!`);

      startIndex = args[0] * 10 - 10;
      endIndex = args[0] * 10 - 1;
      if (endIndex > server_queue.songs.length - 1) {
        endIndex = server_queue.songs.length - 1;
      }

      message.channel.send(getQueueString(server_queue, startIndex, endIndex, args[0], Math.ceil(server_queue.songs.length / 10)) + getTimeString(server_queue));
    } catch (error) {
      message.channel.send("**Error while loading queue!**");
    }
  },
};

function getQueueString(server_queue, startIndex, endIndex, currentPage, maxPage) {
  let string = `**Page ${currentPage} out of ${maxPage}**\n\n`;

  for (let index = startIndex; index <= endIndex; index++) {
    const song = server_queue.songs[index];
    let duration = song.duration;

    let CurrentDuration = 0;

    let prefix = "    ";

    if (index < server_queue.currentSong) {
      CurrentDuration = duration;
    } else if (index == server_queue.currentSong) {
      CurrentDuration = server_queue.audio_player._state.resource.playbackDuration + server_queue.currentOffset;
      prefix = "❱❱";
    }

    let dot = "";
    if (song.title.length > 80) dot = "...";
    string += `${prefix}\`[${index + 1}] [${format(CurrentDuration)}/${format(duration)}]\` ${song.title.substring(0, 80)}${dot}\n`;
  }
  return string;
}

function getTimeString(server_queue) {
  let totalMilliSeconds = 0;
  let totalMilliSecondsPassed = 0;

  for (let index = 0; index < server_queue.songs.length; index++) {
    const song = server_queue.songs[index];
    let duration = song.duration;
    totalMilliSeconds += duration;

    let CurrentDuration = 0;

    if (index < server_queue.currentSong) {
      CurrentDuration = duration;
      totalMilliSecondsPassed += duration;
    } else if (index == server_queue.currentSong) {
      CurrentDuration = server_queue.audio_player._state.resource.playbackDuration + server_queue.currentOffset;
      totalMilliSecondsPassed += CurrentDuration;
    }
  }

  const formattedTimeString = `\n**A total of \`${server_queue.songs.length}\` songs have been queued.
  \nCurrent queue time \`[${format(totalMilliSecondsPassed)}/${format(totalMilliSeconds)}]\`**`;
  return formattedTimeString;
}