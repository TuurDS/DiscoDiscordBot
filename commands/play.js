const {
  video_player,
  safeExit,
  sendMessage
} = require("../functions/functions");

module.exports = {
  name: "play",
  aliases: ["p"],
  cooldown: 0,
  description: "this command will play a song!",
  async execute(client, message, cmd, args) {



    try {
      //FLAGS
      const voice_channel = message.member.voice.channel;
      if (!voice_channel) return sendMessage(message.channel, "You need to be in a channel to execute this command!");
      const permissions = voice_channel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT")) return sendMessage(message.channel, "You dont have the correct permissions");
      if (!permissions.has("SPEAK")) return sendMessage(message.channel, "You dont have the correct permissions");
      if (!args.length) return sendMessage(message.channel, "You need to send a second argument!");

      //CODE
      let guildQueue = client.player.getQueue(message.guild.id);
      let queue = client.player.createQueue(message.guild.id);

      await queue.join(message.member.voice.channel);
      let song = await queue.play(args.join(' ')).catch(err => {
          console.log(err);
          if(!guildQueue)
              queue.stop();
      });

      sendMessage(message.channel, `👍 **[${song.title}](${song.url})** added to queue!`, "GREEN");
      queue.setData({
        channel: message.channel
      });

      //log all the data of the song
      console.log("author: %s", song?.author);
      console.log("data: %s", song?.data);
      console.log("duration: %s", song?.duration);
      console.log("isFirst: %s", song?.isFirst);
      console.log("isLive: %s", song?.isLive);
      console.log("milliseconds: %s", song?.milliseconds);
      console.log("name: %s", song?.name);
      console.log("player: %s", song?.player);
      console.log("thumbnail: %s", song?.thumbnail);
      console.log("queue: %s", song?.queue);
      console.log("requestedBy: %s", song?.requestedBy);
      console.log("seekTime: %s", song?.seekTime);
      console.log("url: %s", song?.url);
    
    } catch (error) {
      console.log(error);
      sendMessage(message.channel, "**an error occurred!**");
    }
  },
};

      // const voice_channel = message.member.voice.channel;
      // if (!voice_channel) return sendMessage(message.channel, "You need to be in a channel to execute this command!");
      // const permissions = voice_channel.permissionsFor(message.client.user);
      // if (!permissions.has("CONNECT")) return sendMessage(message.channel, "You dont have the correct permissions");
      // if (!permissions.has("SPEAK")) return sendMessage(message.channel, "You dont have the correct permissions");

      // let server_queue = queue.get(message.guild.id);

      // if (!args.length) return sendMessage(message.channel, "You need to send a second argument!");
      // let song = {};
      // let fullPlaylist = [];
      // let playlistTitle = {};
      // let playlistUrl = "";
      // let PlaylistLoadingMessage = null;

      // if (isValidHttpUrl(args[0])) {
      //   if (play.yt_validate(args[0]) === "video") {
      //     const song_info = await ytdl.getInfo(args[0]);
      //     song = {
      //       title: song_info.videoDetails.title,
      //       duration: parseInt(song_info.videoDetails.lengthSeconds) * 1000,
      //       description: song_info.videoDetails.description || "wasnt able to fetch!",
      //       url: song_info.videoDetails.video_url,
      //       thumbnail: song_info.videoDetails.thumbnails[0].url,
      //       author: {
      //         url: song_info.videoDetails.author.channel_url,
      //         name: song_info.videoDetails.author.name,
      //         thumbnail: song_info.videoDetails.author.thumbnails[0].url,
      //       },
      //       requested: message.author.username + "#" + message.author.discriminator,
      //     };
      //   } else if (play.yt_validate(args[0]) === "playlist") {
      //     PlaylistLoadingMessage = await sendMessage(message.channel, "Playlist loading...", "ORANGE");
      //     try {
      //         let playlist = await ytfps(args[0]);
      //         playlistTitle = playlist.title;
      //         playlistUrl = playlist.url;
              
      //         for (const video of playlist.videos) {
      //           try {
      //             song = {
      //               title: video.title,
      //               duration: video.milis_length,
      //               description: "",
      //               url: video.url,
      //               thumbnail: video.thumbnail_url,
      //               author: {
      //                 url: video.author.url,
      //                 name: video.author.name,
      //                 thumbnail: "",
      //               },
      //               requested: message.author.username + "#" + message.author.discriminator,
      //             };
      //             fullPlaylist.push(song);
      //           } catch (error) {
      //             continue;
      //           }
      //         }
      //       } catch (error) {
      //         let playlist = await play.playlist_info(args[0], {
      //           incomplete: true,
      //         });
      //         if (args[0].includes("playlist") && playlist.link) {
      //           playlist = await play.playlist_info(playlist.link, {
      //             incomplete: true,
      //           });
      //         }
      //         playlistTitle = playlist.title;
      //         playlistUrl = playlist.url;
            
      //         for (const video of playlist.videos) {
      //           try {
      //             song = {
      //               title: video.title,
      //               duration: video.durationInSec * 1000,
      //               description: "",
      //               url: video.url,
      //               thumbnail: video.thumbnails[0].url,
      //               author: {
      //                 url: video.channel.url,
      //                 name: video.channel.name,
      //                 thumbnail: "",
      //               },
      //               requested: message.author.username + "#" + message.author.discriminator,
      //             };
      //             fullPlaylist.push(song);
      //           } catch (error) {
      //             continue;
      //           }
      //         }
      //       }
      //     } else {
      //       return sendMessage(message.channel, "Cannot load this type of url!");
      //     }
      //   } else {
      //   const video_finder = async (query) => {
      //     const video_result = await ytSearch(query);
      //     return video_result.videos.length > 1 ? video_result.videos[0] : null;
      //   };
        
      //   const video = await video_finder(args.join(" "));
      //   if (video) {
      //     const song_info = await ytdl.getInfo(video.url);
      //     song = {
      //       title: song_info.videoDetails.title,
      //       duration: parseInt(song_info.videoDetails.lengthSeconds) * 1000,
      //       description: song_info.videoDetails.description,
      //       url: song_info.videoDetails.video_url,
      //       thumbnail: song_info.videoDetails.thumbnails[0].url,
      //       author: {
      //         url: song_info.videoDetails.author.channel_url,
      //         name: song_info.videoDetails.author.name,
      //         thumbnail: song_info.videoDetails.author.thumbnails[0].url,
      //       },
      //       requested: message.author.username + "#" + message.author.discriminator,
      //     };
      //   } else {
      //     return sendMessage(message.channel, "Error finding video.");
      //   }
      // }
      // if (!server_queue) {
      //   const queue_constructor = {
      //     voice_channel: voice_channel,
      //     text_channel: message.channel,
      //     connection: null,
      //     audio_player: null,
      //     subscription: null,
      //     repeat: false,
      //     currentSong: 0,
      //     currentOffset: 0,
      //     errors: {
      //       count: 0,
      //       previousInARowMessage: null,
      //       responseDataErrorCount: 0,
      //     },
      //     nowplaying: null,
      //     previousMessage: null,
      //     songs: [],
      //   };
      //   queue.set(message.guild.id, queue_constructor);
      //   server_queue = queue.get(message.guild.id);
      //   if (play.yt_validate(args[0]) === "playlist") {
      //     server_queue.songs = server_queue.songs.concat(fullPlaylist);
      //     PlaylistLoadingMessage.delete();
      //     sendMessage(message.channel, `👍 Playlist [${playlistTitle}](${playlistUrl}) with **\`${fullPlaylist.length}\`** songs added to queue!`, "GREEN");
      //   } else {
      //     server_queue.songs.push(song);
      //     sendMessage(message.channel, `👍 **[${song.title}](${song.url})** added to queue!`, "GREEN");
      //   }
      //   server_queue = queue.get(message.guild.id);
      // } else {
      //   server_queue.voice_channel = voice_channel;
      //   server_queue.text_channel = message.channel;

      //   if (play.yt_validate(args[0]) === "playlist") {
      //     server_queue.songs = server_queue.songs.concat(fullPlaylist);
      //     PlaylistLoadingMessage.delete();
      //     sendMessage(message.channel, `👍 Playlist [${playlistTitle}](${playlistUrl}) with **\`${fullPlaylist.length}\`** songs added to queue!`, "GREEN");
      //   } else {
      //     server_queue.songs.push(song);
      //     sendMessage(message.channel, `👍 **[${song.title}](${song.url})** added to queue!`, "GREEN");
      //   }
      // }
      // try {
      //   if (!server_queue.connection) {
      //     const connection = joinVoiceChannel({
      //       channelId: message.member.voice.channel.id,
      //       guildId: message.guild.id,
      //       adapterCreator: message.guild.voiceAdapterCreator,
      //     });
      //     server_queue.connection = connection;
      //   }

      //   if (!server_queue.audio_player || !server_queue.subscription) {
      //     video_player(client, message, server_queue.songs[server_queue.currentSong], queue);
      //   }
      // } catch (error) {
      //   safeExit(queue, message.guild.id);
      //   sendMessage(message.channel, "There was an error connecting!");
      //   console.log(error);
      // }