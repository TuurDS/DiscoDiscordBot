const format = require("format-duration");
const {
  sendMessage
} = require("../functions/functions");
const Discord = require("discord.js");
module.exports = {
  name: "queue",
  description: "shows the current queue!",
  async execute(client, message, cmd, args, Discord, queue) {
    try {
      const voice_channel = message.member.voice.channel;
      if (!voice_channel)
        return sendMessage(message.channel, "You need to be in a channel to execute this command!");
      const server_queue = queue.get(message.guild.id);
      if (!server_queue || server_queue.songs.length < 1) {
        return sendMessage(message.channel, "**Queue is empty!**");
      }
      if (!args[0]) {
        args[0] = Math.ceil((server_queue.currentSong + 1) / 10);
      }
      if (isNaN(args[0])) return sendMessage(message.channel, "please enter a valid number!");
      if (args[0] < 1 || args[0] > Math.ceil(server_queue.songs.length / 10))
        return sendMessage(message.channel, `please enter a number between **1** and **${Math.ceil(server_queue.songs.length / 10)}**`);

      let embed = getQueueEmbed(server_queue, args[0]);
      server_queue.CurrentQueuePageNumber = parseInt(args[0]);

      const row = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
        .setCustomId('QUEUE_FIRST')
        .setLabel('First')
        .setStyle('SUCCESS'),
        new Discord.MessageButton()
        .setCustomId('QUEUE_BACK')
        .setLabel('Back')
        .setStyle('SUCCESS'),
        new Discord.MessageButton()
        .setCustomId('QUEUE_NOW')
        .setLabel('Now')
        .setStyle('SUCCESS'),
        new Discord.MessageButton()
        .setCustomId('QUEUE_NEXT')
        .setLabel('Next')
        .setStyle('SUCCESS'),
        new Discord.MessageButton()
        .setCustomId('QUEUE_LAST')
        .setLabel('Last')
        .setStyle('SUCCESS'),
      );
      const queueMessage = await message.channel.send({
        embeds: [embed],
        components: [row]
      });

      setTimeout(function () {
        row.components.forEach(e => e.setDisabled(true));
        queueMessage.edit({
          embeds: [embed],
          components: [row]
        });
      }, 300000);

      const collector = queueMessage.createMessageComponentCollector({
        componentType: 'BUTTON',
        time: 300000
      });

      collector.on('collect', i => {
        i.deferUpdate();
        if (i.customId == "QUEUE_FIRST") {
          i.message.edit({
            embeds: [getQueueEmbed(server_queue, 1)],
            components: [row]
          });
          server_queue.CurrentQueuePageNumber = 1;
        } else if (i.customId == "QUEUE_LAST") {
          i.message.edit({
            embeds: [getQueueEmbed(server_queue, Math.ceil(server_queue.songs.length / 10))],
            components: [row]
          });
          server_queue.CurrentQueuePageNumber = Math.ceil(server_queue.songs.length / 10);
        } else if (i.customId == "QUEUE_NEXT") {
          if (server_queue.CurrentQueuePageNumber != Math.ceil(server_queue.songs.length / 10)) {
            i.message.edit({
              embeds: [getQueueEmbed(server_queue, server_queue.CurrentQueuePageNumber + 1)],
              components: [row]
            });
            server_queue.CurrentQueuePageNumber++;
          }
        } else if (i.customId == "QUEUE_BACK") {
          if (server_queue.CurrentQueuePageNumber != 1) {
            i.message.edit({
              embeds: [getQueueEmbed(server_queue, server_queue.CurrentQueuePageNumber - 1)],
              components: [row]
            });
            server_queue.CurrentQueuePageNumber--;
          }
        } else if (i.customId == "QUEUE_NOW") {
          i.message.edit({
            embeds: [getQueueEmbed(server_queue, Math.ceil((server_queue.currentSong + 1) / 10))],
            components: [row]
          });
          server_queue.CurrentQueuePageNumber = Math.ceil((server_queue.currentSong + 1) / 10);;
        }
      });
    } catch (error) {
      console.error(error)
      sendMessage(message.channel, "**an error occurred!**");
    }
  },
};

function getQueueEmbed(server_queue, PageIndex) {
  startIndex = PageIndex * 10 - 10;
  endIndex = PageIndex * 10 - 1;
  if (endIndex > server_queue.songs.length - 1) {
    endIndex = server_queue.songs.length - 1;
  }
  const string = getQueueString(server_queue, startIndex, endIndex, PageIndex, Math.ceil(server_queue.songs.length / 10)) + getTimeString(server_queue);
  return createEmbed(string, "GREEN");
}

function createEmbed(string, color) {
  let embed = new Discord.MessageEmbed()
    .setColor(color)
    .setDescription(string)
    .setFooter({
      text: "This message will stop interacting after 5 minutes."
    })
  return embed;
}

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
    if (song.title.length > 50) dot = "...";
    string += `${prefix}\`[${index + 1}] [${format(CurrentDuration)}/${format(duration)}]\` [${song.title.substring(0, 50).replace("[","［").replace("]","］")}](${song.url})${dot}\n`;
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
  const song = server_queue.songs[server_queue.currentSong];
  const formattedTimeString = `\n**A total of \`${server_queue.songs.length}\` songs have been queued.
  Current song: [${server_queue.currentSong + 1}] [${song.title}](${song.url})\nCurrent time in the queue\`[${format(totalMilliSecondsPassed)}/${format(totalMilliSeconds)}]\`**`;
  return formattedTimeString;
}