const format = require("format-duration");

module.exports = {
  name: "nowplaying",
  aliases: ["np"],
  description: "bot leaves vc",
  async execute(client, message, cmd, args, Discord, queue) {
    try {
      const server_queue = queue.get(message.guild.id);

      const song = server_queue.nowplaying;

      if (!server_queue || server_queue.connection == null || song == null) {
        return message.channel.send("**no song is currently playing!**");
      }

      const playbackTimeString = format(server_queue.audio_player._state.resource.playbackDuration + server_queue.currentOffset);
      const DurationTimeString = format(song.duration);

      const formattedTimeString = "[" + playbackTimeString + "/" + DurationTimeString + "]";

      let extend = "";

      if (song.description.length > 512) {
        extend = "[...]";
      }

      let embed = new Discord.MessageEmbed()
        .setAuthor({
          name: song.author.name,
          url: song.author.url,
          iconURL: song.author.thumbnail,
        })
        .setColor("RED")
        .setTitle(song.title)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .addFields([{
            name: "**Time**",
            value: formattedTimeString,
            inline: false,
          },
          {
            name: "**Description**",
            value: `${song.description.substring(0, 512)} ${extend}`,
            inline: false,
          },
        ])
        .setFooter({
          text: `Requested by ${song.requested}`,
        });

      message.channel.send({
        embeds: [embed],
      });
    } catch (error) {
      console.log(error);
      message.channel.send("**An Error occurred!**");
    }
  },
};