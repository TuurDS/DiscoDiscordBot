const play = require("play-dl");
const {
    getVoiceConnection,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
} = require("@discordjs/voice");

module.exports = {
    name: "seek",
    aliases: [],
    description: "seek to a specific time in the song!",
    async execute(client, message, cmd, args, Discord, queue) {
        try {
            const voice_channel = message.member.voice.channel;
            if (!voice_channel)
                return message.channel.send("You need to be in a channel to execute this command!");

            let server_queue = queue.get(message.guild.id);
            if (!server_queue.audio_player || !server_queue.songs[server_queue.currentSong]) return message.reply("**There is nothing to seek to!**");
            if (!args[0]) return message.reply("please enter where you want to seek to!");
            if (isNaN(args[0])) return message.reply("please enter a valid number!");
            if (args[0] < 0 || args[0] > server_queue.songs[server_queue.currentSong].duration / 1000 - 1)
                return message.channel.send(`please enter a number between 1 and ${server_queue.songs[server_queue.currentSong].duration / 1000 - 1}!`);

            video_player(message, server_queue.songs[server_queue.currentSong], queue, parseInt(args[0]));
            message.reply(`seeked to ${parseInt(args[0])} seconds!`);
        } catch (error) {
            console.log(error);
            message.channel.send("**An Error occurred!**");
        }
    },
};

const video_player = async (message, song, queue, seekTo) => {
    const guild = message.guild;
    const server_queue = queue.get(guild.id);
    server_queue.currentOffset = seekTo * 1000;

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

    const stream = await play.stream(song.url, {
        seek: seekTo,
    });

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