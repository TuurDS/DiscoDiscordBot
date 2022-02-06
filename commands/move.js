const {
    sendMessage
} = require("../functions/functions");
module.exports = {
    name: "move",
    aliases: [],
    description: "moves a song to a new position!",
    async execute(client, message, cmd, args, Discord, queue) {
        try {
            const voice_channel = message.member.voice.channel;
            if (!voice_channel) return sendMessage(message.channel, "You need to be in a channel to execute this command!");

            let server_queue = queue.get(message.guild.id);

            if (!server_queue || !server_queue.songs) return sendMessage(message.channel, "**There are no tracks to be moved!**");
            if (server_queue.songs.length < 2) return sendMessage(message.channel, "There are not enough tracks to be moved (**min 2**)!");
            if (!args[0]) return sendMessage(message.channel, "please enter the the index of the item you want to be moved and the index you want it to move to!");
            const arguments = args[0].split(",");
            if (!arguments[0] || !arguments[1]) return sendMessage(message.channel, "please enter the the index of the item you want to be moved and the index you want it to move to!");
            if (isNaN(arguments[0]) || isNaN(arguments[1])) return sendMessage(message.channel, "please enter a valid number!");
            if (arguments[0] < 1 || arguments[1] < 1 || arguments[0] > server_queue.songs.length || arguments[1] > server_queue.songs.length)
                return sendMessage(message.channel, `please enter numbers between **1** and **${server_queue.songs.length}**`);

            const MovedSong = server_queue.songs.splice(arguments[0] - 1, 1)[0];
            server_queue.songs.splice(arguments[1] - 1, 0, MovedSong);
            sendMessage(message.channel, `moved [${MovedSong.title}](${MovedSong.url}) from position **${arguments[0]}** to **${arguments[1]}**`, "GREEN");
        } catch (error) {
            console.log(error);
            sendMessage(message.channel, "**an error occurred!**");
        }
    },
};