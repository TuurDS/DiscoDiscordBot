const play = require("play-dl");
const {
    getVoiceConnection,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
} = require("@discordjs/voice");

module.exports = {
    name: "rewind",
    aliases: ["rw"],
    description: "rewinds a specific amount of time!",
    async execute(client, message, cmd, args, Discord, queue) {
        try {
            const voice_channel = message.member.voice.channel;
            if (!voice_channel)
                return message.channel.send("You need to be in a channel to execute this command!");

            let server_queue = queue.get(message.guild.id);
            if (!server_queue.audio_player || !server_queue.songs[server_queue.currentSong]) return message.reply("**There is nothing to rewind!**");
            if (!args[0]) return message.reply("please enter the amount you want to rewind!");
            if (isNaN(args[0])) return message.reply("please enter a valid number!");
            if (args[0] < 1 || args[0] > server_queue.songs[server_queue.currentSong].duration / 1000 - 1)
                return message.reply(`please enter a number between 1 and ${server_queue.songs[server_queue.currentSong].duration / 1000 - 1}!`);
            let offset = (server_queue.audio_player._state.resource.playbackDuration + server_queue.currentOffset) / 1000 - parseInt(args[0]);
            if (offset < 0) {
                offset = 0;
            }
            video_player(message, server_queue.songs[server_queue.currentSong], queue, offset);
            message.channel.send(`rewinded ${parseInt(args[0])} seconds!`);
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

    // if (!server_queue.audio_player) {
    const player = createAudioPlayer();
    server_queue.audio_player = player;
    server_queue.audio_player.on("error", (error) => {
        console.log(error);
    });
    server_queue.audio_player.on(AudioPlayerStatus.Idle, () => {
        video_player(message, fetchNextSong(server_queue), queue);
    });
    // }

    // if (!server_queue.subscription) {
    const subscription = getVoiceConnection(guild.id).subscribe(
        server_queue.audio_player
    );
    server_queue.subscription = subscription;
    // }

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