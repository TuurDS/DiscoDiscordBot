const format = require("format-duration");
const {
  sendMessage
} = require("../functions/functions");
const ytdl = require("ytdl-core");
const play = require("play-dl");

const Discord = require("discord.js");

module.exports = {
  name: "nowplaying",
  aliases: ["np"],
  description: "bot leaves vc",
  async execute(client, message, cmd, args) {
    try {

      const queue = client.player.getQueue(message.guild.id) || client.player.createQueue(message.guild.id);
      //send a message to the channel with the current song playing and the number in the queue
      const song = queue.nowPlaying;

      const formattedTimeString = `[${format(song.seekTime)}/${song.duration}]`;

      let embed = new Discord.MessageEmbed()
        .setAuthor({
          name: song.author,
          url: song.thumbnail,
          iconURL: song.author.thumbnail,
        })
        .setColor("ORANGE")
        .setTitle(song.name)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .addFields([{
            name: "**Time**",
            value: formattedTimeString,
            inline: false,
          },{
          name: "**Time2**",
          value: `[${format(song)}/${song.duration}]`,
          inline: false,
        },
          // {
          //   name: "**Description**",
          //   value: `${song.description.substring(0, 512)} ${extend}`,
          //   inline: false,
          // },

        ]);
      message.channel.send({
        embeds: [embed],
      });
      // const server_queue = queue.get(message.guild.id);

      // const song = server_queue.nowplaying;

      // if (!server_queue || server_queue.connection == null || song == null) {
      //   return sendMessage(message.channel, "**no song is currently playing!**");
      // }
      // if (!song.description || !song.author.thumbnail) {
      //   const song_info = await play.video_basic_info(song.url);
      //   song.description = song_info.video_details.description || "No description available";
      //   song.author.thumbnail = song_info.video_details.channel.icons[0].url;
      // }

      // const playbackTimeString = format(server_queue.audio_player._state.resource.playbackDuration + server_queue.currentOffset);
      // const DurationTimeString = format(song.duration);

      // const formattedTimeString = "[" + playbackTimeString + "/" + DurationTimeString + "]";

      // let extend = "";

      // if (song.description.length > 512) {
      //   extend = "[...]";
      // }

      // let embed = new Discord.MessageEmbed()
      //   .setAuthor({
      //     name: song.author.name,
      //     url: song.author.url,
      //     iconURL: song.author.thumbnail,
      //   })
      //   .setColor("ORANGE")
      //   .setTitle(song.title)
      //   .setURL(song.url)
      //   .setThumbnail(song.thumbnail)
      //   .addFields([{
      //       name: "**Time**",
      //       value: formattedTimeString,
      //       inline: false,
      //     },
      //     {
      //       name: "**Description**",
      //       value: `${song.description.substring(0, 512)} ${extend}`,
      //       inline: false,
      //     },
      //   ])
      //   .setFooter({
      //     text: `Requested by ${song.requested}`,
      //   });

      // message.channel.send({
      //   embeds: [embed],
      // });
    } catch (error) {
      console.log(error);
      sendMessage(message.channel, "**an error occurred!**");
    }
  },
};