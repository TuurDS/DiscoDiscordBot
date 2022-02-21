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

        const queue_constructor = {
            voice_channel: null,
            text_channel: null,
            connection: null,
            audio_player: null,
            subscription: null,
            repeat: server_queue.repeat,
            currentSong: 0,
            currentOffset: 0,
            errors: {
                count: 0,
                previousInARowMessage: null,
                responseDataErrorCount: 0,
            },
            nowplaying: null,
            previousMessage: null,
            songs: [],
        };
        queue.set(guildId, queue_constructor);
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

const video_player = async (client, message, song, queue, seekTo = -1) => {
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
            play.setToken({
                useragent: ['disco-discordbot-tds']
           }) 
            const player = createAudioPlayer();
            server_queue.audio_player = player;
            server_queue.audio_player.on("error", (error) => {
                console.log(error);
            });
            server_queue.audio_player.on(AudioPlayerStatus.Idle, () => {
                video_player(client, message, fetchNextSong(server_queue), queue);
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
        //throw Error("testing error bug");

        server_queue.audio_player.play(resource);

        server_queue.nowplaying = song;
        if (!withSeek) {
            if (server_queue.previousMessage) {
                server_queue.previousMessage.delete();
            }
            const msg = await sendMessage(server_queue.text_channel, `🎶 Now playing **[${server_queue.currentSong + 1}]**  [${song.title}](${song.url})`, "ORANGE");
            server_queue.previousMessage = msg;
        }
        server_queue.errors.count = 0;
        server_queue.errors.responseDataErrorCount = 0;

    } catch (error) {
        let server_queue = queue.get(message.guild.id);

        server_queue.errors.responseDataErrorCount++;
        if (server_queue.errors.responseDataErrorCount <= 5) {
            video_player(client, message, song, queue);
        } else {
            server_queue.errors.responseDataErrorCount = 0;
            if (server_queue.errors.count > 0) {
                server_queue.errors.count++;
                server_queue.errors.previousInARowMessage.delete();
                server_queue.errors.previousInARowMessage = await sendMessage(message.channel, `an error with **${server_queue.errors.count}** videos in a row occurred, Trying to skip !`);
                console.log("error in functions video_player\n", error);
                await sendErrorMessage(client, `**[${server_queue.currentSong}]** [${server_queue.songs[server_queue.currentSong+1].title}](${server_queue.songs[server_queue.currentSong].url}):\n${error}`);
            } else {
                server_queue.errors.count++;
                server_queue.errors.previousInARowMessage = await sendMessage(message.channel, `an error with **${server_queue.errors.count}** video in a row occurred, Trying to skip !`);
                console.log("error in functions video_player\n", error);
                await sendErrorMessage(client, `**[${server_queue.currentSong}]** [${server_queue.songs[server_queue.currentSong+1].title}](${server_queue.songs[server_queue.currentSong].url}):\n${error}`);
            }
            video_player(client, message, fetchNextSong(queue.get(message.guild.id)), queue);
        }
    }
};

const sendErrorMessage = async (client, returnMessage, color = "F70000") => {
    try {
        let channel = client.channels.cache.get("940729631986827336");
        let embed = new Discord.MessageEmbed()
            .setTitle("ERROR")
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