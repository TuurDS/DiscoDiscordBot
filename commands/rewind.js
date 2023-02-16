const {
    video_player,
    sendMessage
} = require("../functions/functions");
module.exports = {
    name: "rewind",
    aliases: ["rw"],
    description: "rewinds a specific amount of time!",
    async execute(client, message, cmd, args) {
        try {
            const voice_channel = message.member.voice.channel;
            if (!voice_channel) return sendMessage(message.channel, "You need to be in a channel to execute this command!");

            const queue = client.player.getQueue(message.guild.id) || client.player.createQueue(message.guild.id);
            const nowPlaying = queue.nowPlaying;

            if (!nowPlaying) return sendMessage(message.channel, "**There is no song to rewind!**");
            if (!args[0]) return sendMessage(message.channel, "please enter an amount you want to rewind!");
            if (isNaN(args[0])) return sendMessage(message.channel, "please enter a valid number!");
            if (args[0] < 1) return sendMessage(message.channel, `please enter a number greater than **1**`);

            let currentseconds = nowPlaying.seekTime;

            //rewind the song by the amount of seconds, if the amount of seconds is less than 0, then set the seek time to 0
            if (currentseconds - parseInt(args[0]) < 0) {
                queue.seek(0);
                sendMessage(message.channel, `rewinded **${currentseconds}** seconds!`, "GREEN");
            } else {
                queue.seek(currentseconds - parseInt(args[0]));
                sendMessage(message.channel, `rewinded **${parseInt(args[0])}** seconds!`, "GREEN");
            }

        } catch (error) {
            console.log(error);
            sendMessage(message.channel, "**an error occurred!**");
        }
    },
};