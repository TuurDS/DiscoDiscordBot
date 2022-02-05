const play = require("play-dl");
const {
    getVoiceConnection,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
} = require("@discordjs/voice");

const safeExit = (queue, guildId) => {
    try {
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
    } catch (error) {
        console.error("error in functions safeExit\n\n", error);
        message.channel.send("an error with this command occurred!");
    }
};

const fetchNextSong = (server_queue) => {
    try {
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
    } catch (error) {
        console.error("error in functions fetchNextSong\n\n", error);
        message.channel.send("an error with this command occurred!");
    }
};

const video_player = async (message, song, queue, seekTo = -1) => {
    try {
        let withSeek = true;
        if (seekTo == -1) {
            withSeek = false;
            seekTo = 0;
        }

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


        const stream = await play.stream(song.url, {
            seek: seekTo,
        });

        let resource = createAudioResource(stream.stream, {
            inputType: stream.type,
        });

        server_queue.audio_player.play(resource);

        server_queue.nowplaying = song;
        if (!withSeek) {
            server_queue.text_channel.send(`🎶 Now playing **${song.title} [${server_queue.currentSong + 1}]**`);
        }

    } catch (error) {
        console.error("error in functions video_player\n\n", error);
        message.channel.send("an error with this video occurred!");
    }
};

module.exports = {
    safeExit: safeExit,
    fetchNextSong: fetchNextSong,
    video_player: video_player,
}