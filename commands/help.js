const {
    sendMessage
} = require("../functions/functions");
module.exports = {
    name: "help",
    description: "this is a help command!",
    execute(client, message, cmd, args, Discord) {
        try {
            sendMessage(message.channel, "```<COMMANDS>\n-clear\n-clearmsg [1-99]\n-join\n-leave (leaves without clearing queue)\n-nowplaying  / -np\n-pause / -ps\n-resume / -rs\n-ping\n-play [url]\n-skip (optional)[amount of tracks]\n-queue\n-removesong [queueNumber] / -rms[queueNumber]\n-repeat\n-shuffle / -sf\n-stop (cleares queue and leaves)\n-jump [number of tracks]\n-fastforward [number of seconds] / -ff [number of seconds]\n-rewind [number of seconds] / -rw [number of seconds]\n-seek [number of seconds]\n-move [trackposition],[new position]```", "GREEN");
        } catch (error) {
            console.log(error);
            sendMessage(message.channel, "**an error occurred!**");
        }
    },
};