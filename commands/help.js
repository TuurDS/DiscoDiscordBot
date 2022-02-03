module.exports = {
    name: "help",
    description: "this is a help command!",
    execute(client, message, cmd, args, Discord) {
        try {
            message.channel.send("`help\n...`");
        } catch (error) {
            console.log(error);
            message.channel.send("**An Error occurred!**");
        }
    },
};