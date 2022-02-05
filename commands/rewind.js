const {
    video_player
} = require("../functions/functions");
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