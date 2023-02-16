const {
    video_player,
    sendMessage
} = require("../functions/functions");
module.exports = {
    name: "seek",
    aliases: [],
    description: "seek to a specific time in the song!",
    async execute(client, message, cmd, args) {
        try {
            const voice_channel = message.member.voice.channel;
            if (!voice_channel) return sendMessage(message.channel, "You need to be in a channel to execute this command!");
      
            const queue = client.player.getQueue(message.guild.id) || client.player.createQueue(message.guild.id);
            const nowPlaying = queue.nowPlaying;
      
            if (!nowPlaying) return sendMessage(message.channel, "**There is no song to seek!**");
            if (!args[0]) return sendMessage(message.channel, "please enter an amount of seconds to seek to!");
            if (isNaN(args[0])) return sendMessage(message.channel, "please enter a valid number!");
            if (args[0] < 1 || args[0] > nowPlaying.milliseconds / 1000) 
                return sendMessage(message.channel, `please enter a number between **1** and **${nowPlaying.milliseconds / 1000}`);

            queue.seek(parseInt(args[0]));
      
            sendMessage(message.channel, `playing at **${parseInt(args[0])}** seconds!`, "GREEN");
      
        } catch (error) {
            console.log(error);
            sendMessage(message.channel, "**an error occurred!**");
        }
    },
};