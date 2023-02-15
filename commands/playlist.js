const {
    video_player,
    safeExit,
    sendMessage
  } = require("../functions/functions");
  
  module.exports = {
    name: "playlist",
    aliases: ["pl"],
    cooldown: 0,
    description: "this command will play a playlist!",
    async execute(client, message, cmd, args) {
      let PlaylistLoadingMessage;
      try {
        //FLAGS
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return sendMessage(message.channel, "You need to be in a channel to execute this command!");
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) return sendMessage(message.channel, "You dont have the correct permissions");
        if (!permissions.has("SPEAK")) return sendMessage(message.channel, "You dont have the correct permissions");
        if (!args.length) return sendMessage(message.channel, "You need to send a second argument!");

        //CODE

        PlaylistLoadingMessage = await sendMessage(message.channel, "Playlist loading...", "ORANGE");
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        let song = await queue.playlist(args.join(' ')).catch(err => {
            console.log(err);
            if(!guildQueue)
                queue.stop();
        });

        PlaylistLoadingMessage.delete();
        sendMessage(message.channel, `👍 Playlist [${song.name}](${song.url}) with **\`${song.songs.length}\`** songs added to queue!`, "GREEN");

        queue.setData({
            channel: message.channel
        });

        console.log("author: %s", song?.author);
        console.log("name: %s", song?.name);
        console.log("player: %s", song?.player);
        console.log("queue: %s", song?.queue);
        console.log("songs: %s", song?.songs);
        console.log("url: %s", song?.url);
        console.log("size: %s", song?.songs?.length);

      } catch (error) {
        console.log(error);
        PlaylistLoadingMessage.delete();
        sendMessage(message.channel, "**an error occurred!**");
      }
    },
  };