const {
    video_player
} = require("../functions/functions");
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