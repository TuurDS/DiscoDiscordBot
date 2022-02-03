const play = require("play-dl");
const {
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} = require("@discordjs/voice");

module.exports = {
  name: "skip",
  description: "skippes the current track",
  async execute(client, message, cmd, args, Discord, queue) {
    try {
      const voice_channel = message.member.voice.channel;
      if (!voice_channel) return message.channel.send("You need to be in a channel to execute this command!");
      const permissions = voice_channel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT")) return message.channel.send("You dont have the correct permissions");
      if (!permissions.has("SPEAK")) return message.channel.send("You dont have the correct permissions");

      let server_queue = queue.get(message.guild.id);
      if (!message.member.voice.channel) return message.channel.send("You need to be in a channel to execute this command!");
      if (!server_queue || !server_queue.songs) {
        return message.channel.send(`There are no songs in queue 😔`);
      }
      if (!args[0]) {
        args[0] = 1;
      }
      if (isNaN(args[0])) return message.reply("please enter a valid number!");
      args[0] = parseInt(args[0]);
      if (args[0] < 1 || args[0] > server_queue.songs.length) return message.reply(`please enter a number between 1 and ${server_queue.songs.length}!`);

      let total = server_queue.currentSong + args[0];

      if (server_queue.repeat) {
        total = total % server_queue.songs.length;
      }
      server_queue.currentSong = total - 1;
      let str = "songs";
      if (args[0] < 2) str = "song";
      message.channel.send(`Skipped **${args[0]} ${str}**`);
      video_player(message, fetchNextSong(server_queue), queue);
    } catch (error) {
      console.log(error);
      message.channel.send("**An Error occurred!**");
    }
  },
};

const video_player = async (message, song, queue) => {
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
    const subscription = getVoiceConnection(guild.id).subscribe(
      server_queue.audio_player
    );
    server_queue.subscription = subscription;
  }

  server_queue.nowplaying = song;
  server_queue.text_channel.send(
    `🎶 Now playing **${song.title} [${server_queue.currentSong + 1}]**`
  );
  const stream = await play.stream(song.url);

  let resource = createAudioResource(stream.stream, {
    inputType: stream.type,
  });

  server_queue.audio_player.play(resource);
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