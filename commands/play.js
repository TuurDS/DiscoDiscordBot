const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const play = require("play-dl");
const {
  joinVoiceChannel,
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} = require("@discordjs/voice");

module.exports = {
  name: "play",
  aliases: ["p"],
  cooldown: 0,
  description: "play, skip and stop command",
  async execute(client, message, cmd, args, Discord, queue) {
    try {
      const voice_channel = message.member.voice.channel;
      if (!voice_channel) return message.channel.send("You need to be in a channel to execute this command!");
      const permissions = voice_channel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT")) return message.channel.send("You dont have the correct permissions");
      if (!permissions.has("SPEAK")) return message.channel.send("You dont have the correct permissions");

      let server_queue = queue.get(message.guild.id);

      if (!args.length) return message.channel.send("You need to send the second argument!");
      let song = {};
      let fullPlaylist = [];
      let playlistTitle = {};

      if (isValidHttpUrl(args[0])) {
        if (play.yt_validate(args[0]) === "video") {
          const song_info = await ytdl.getInfo(args[0]);

          song = {
            title: song_info.videoDetails.title,
            duration: parseInt(song_info.videoDetails.lengthSeconds) * 1000,
            description: song_info.videoDetails.description || "wasnt able to fetch!",
            url: song_info.videoDetails.video_url,
            thumbnail: song_info.videoDetails.thumbnails[0].url,
            author: {
              url: song_info.videoDetails.author.channel_url,
              name: song_info.videoDetails.author.name,
              thumbnail: song_info.videoDetails.author.thumbnails[0].url,
            },
            requested: message.author.username + "#" + message.author.discriminator,
          };
        } else if (play.yt_validate(args[0]) === "playlist") {
          let playlist = await play.playlist_info(args[0], {
            incomplete: true,
          });
          if (args[0].includes("playlist") && playlist.link) {
            playlist = await play.playlist_info(playlist.link, {
              incomplete: true,
            });
          }
          playlistTitle = playlist.title;

          for (const video of playlist.videos) {
            let thumbnail = "";
            if (video.thumbnails) {
              thumbnail = video.thumbnails[0].url || "";
            }
            song = {
              title: video.title,
              duration: video.durationInSec * 1000,
              description: "wasnt able to fetch!",
              url: video.url,
              thumbnail: thumbnail,
              author: {
                url: video.channel.url,
                name: video.channel.name,
                thumbnail: thumbnail,
              },
              requested: message.author.username + "#" + message.author.discriminator,
            };
            fullPlaylist.push(song);
          }
        } else {
          return message.channel.send("Cannot load this type of url!");
        }
      } else {
        const video_finder = async (query) => {
          const video_result = await ytSearch(query);
          return video_result.videos.length > 1 ? video_result.videos[0] : null;
        };

        const video = await video_finder(args.join(" "));
        if (video) {
          const song_info = await ytdl.getInfo(video.url);
          song = {
            title: song_info.videoDetails.title,
            duration: parseInt(song_info.videoDetails.lengthSeconds) * 1000,
            description: song_info.videoDetails.description,
            url: song_info.videoDetails.video_url,
            thumbnail: song_info.videoDetails.thumbnails[0].url,
            author: {
              url: song_info.videoDetails.author.channel_url,
              name: song_info.videoDetails.author.name,
              thumbnail: song_info.videoDetails.author.thumbnails[0].url,
            },
            requested: message.author.username + "#" + message.author.discriminator,
          };
        } else {
          return message.channel.send("Error finding video.");
        }
      }
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
          nowplaying: null,
          songs: [],
        };
        queue.set(message.guild.id, queue_constructor);
        server_queue = queue.get(message.guild.id);
        if (play.yt_validate(args[0]) === "playlist") {
          server_queue.songs = server_queue.songs.concat(fullPlaylist);
          message.channel.send(`👍 **Playlist ${playlistTitle} with \`${fullPlaylist.length}\`** songs added to queue!`);
        } else {
          server_queue.songs.push(song);
          message.channel.send(`👍 **${song.title}** added to queue!`);
        }
        server_queue = queue.get(message.guild.id);
      } else {
        if (play.yt_validate(args[0]) === "playlist") {
          server_queue.songs = server_queue.songs.concat(fullPlaylist);
          message.channel.send(`👍 **Playlist ${playlistTitle} with \`${fullPlaylist.length}\`** songs added to queue!`);
        } else {
          server_queue.songs.push(song);
          message.channel.send(`👍 **${song.title}** added to queue!`);
        }
      }
      try {
        if (!server_queue.connection) {
          const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
          });
          server_queue.connection = connection;
        }

        if (!server_queue.audio_player || !server_queue.subscription) {
          video_player(message, server_queue.songs[server_queue.currentSong], queue);
        }
      } catch (error) {
        safeExit(queue, message.guild.id);
        message.channel.send("There was an error connecting!");
        console.log(error);
      }
    } catch (error) {
      console.log(error);
      message.channel.send("**An Error occurred!**");
    }
  },
};

const video_player = async (message, song, queue) => {
  try {
    const guild = message.guild;
    const server_queue = queue.get(guild.id);
    server_queue.currentOffset = 0;

    if (!song) {
      server_queue.currentSong = 0;
      server_queue.songs = [];
      safeExit(queue, guild.id);
      message.channel.send(`**no songs left Disco left the voice channel!** 😔`);
      return;
    }

    if (!server_queue.audio_player) {
      const player = createAudioPlayer();
      server_queue.audio_player = player;
      server_queue.audio_player.on("error", (error) => {
        console.log(error);
      });
      server_queue.audio_player.on(AudioPlayerStatus.Idle, () => {
        video_player(message, fetchNextSong(server_queue), queue);
      });
    }

    if (!server_queue.subscription) {
      const subscription = getVoiceConnection(guild.id).subscribe(server_queue.audio_player);
      server_queue.subscription = subscription;
    }
    const stream = await play.stream(song.url);

    let resource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });

    server_queue.audio_player.play(resource);

    server_queue.nowplaying = song;
    server_queue.text_channel.send(`🎶 Now playing **${song.title} [${server_queue.currentSong + 1}]**`);
  } catch (error) {
    console.log("an error has occurred!");
    message.channel.send("an error has occurred!");
  }
};

const safeExit = (queue, guildId) => {
  const server_queue = queue.get(guildId);
  if (!server_queue) return;

  if (server_queue.audio_player) {
    server_queue.audio_player.stop();
    server_queue.audio_player = null;
  }

  if (server_queue.subscription) {
    server_queue.subscription.unsubscribe();
    server_queue.subscription = null;
  }

  if (server_queue.connection) {
    server_queue.connection.destroy();
    server_queue.connection = null;
  }
};

const fetchNextSong = (server_queue) => {
  if (!server_queue) return null;

  if (
    server_queue.repeat &&
    server_queue.currentSong >= server_queue.songs.length - 1
  ) {
    server_queue.currentSong = 0;
  } else {
    server_queue.currentSong += 1;
  }
  return server_queue.songs[server_queue.currentSong];
};

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}