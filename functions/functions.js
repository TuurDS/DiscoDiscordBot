const play = require("play-dl");
const {
    getVoiceConnection,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
} = require("@discordjs/voice");
const Discord = require("discord.js");

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
        sendMessage(message.channel, "an error occurred!");
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
        sendMessage(message.channel, "an error occurred!");
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
            sendMessage(message.channel, "**no songs left Disco left the voice channel!** 😔", "ORANGE");
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
            if (server_queue.previousMessage) {
                server_queue.previousMessage.delete();
            }
            const msg = await sendMessage(server_queue.text_channel, `🎶 Now playing **[${server_queue.currentSong + 1}]**  [${song.title}](${song.url})`, "ORANGE");
            server_queue.previousMessage = msg;
        }

    } catch (error) {
        server_queue = queue.get(message.guild.id);
        if (server_queue.videoErrors >= 5) {
            sendMessage(message.channel, "fatal error occurred cannot skip!");
            server_queue.videoErrors = 0;
        } else {
            server_queue.videoErrors++;
            sendMessage(message.channel, "an error with this video occurred, Trying to skip!");
            video_player(message, fetchNextSong(queue.get(message.guild.id)), queue);
        }
        console.error("error in functions video_player\n\n", error);
    }
};

const sendMessage = async (channel, returnMessage, color = "F70000") => {
    try {
        let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(returnMessage)

        const message = await channel.send({
            embeds: [embed],
        });
        return message;
    } catch (error) {
        console.error("error in functions sendMessage\n\n", error);
    }
}
const sendSelfDestructMessage = async (channel, returnMessage, color = "F70000", timeInMs = 60000) => {
    try {
        if (timeInMs > 3600000) {
            timeInMs = 3600000;
        }
        let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(returnMessage)
            .setFooter({
                text: `this message will self destruct in ${timeInMs/1000}seconds`,
            });

        const message = await channel.send({
            embeds: [embed],
        });
        setTimeout(() => {
            message.delete()
        }, timeInMs);
    } catch (error) {
        console.error("error in functions sendMessage\n\n", error);
    }
}

module.exports = {
    safeExit: safeExit,
    fetchNextSong: fetchNextSong,
    video_player: video_player,
    sendMessage: sendMessage,
    sendSelfDestructMessage: sendSelfDestructMessage
}