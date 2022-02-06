const {
  sendMessage
} = require("../functions/functions");
module.exports = {
  name: "clearmsg",
  description: "Clear messages!",
  async execute(client, message, cmd, args, Discord) {
    try {
      if (!args[0]) return sendMessage(message.channel, "please enter the amount of messages that you want to be cleared!");
      if (isNaN(args[0])) return sendMessage(message.channel, "please enter a valid number!");
      if (args[0] < 1 || args[0] > 99) return sendMessage(message.channel, "please enter a number between **1** and **99**");

      await message.channel.messages.fetch({
        limit: parseInt(args[0]) + 1,
      }).then((messages) => {
        message.channel.bulkDelete(messages);
      });

    } catch (error) {
      console.log(error);
      sendMessage(message.channel, "**an error occurred!**");
    }
  },
};