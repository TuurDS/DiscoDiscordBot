const {
  sendMessage
} = require("../../functions/functions");

module.exports = (queue, newSong, oldSong) => {
  try {
    //log the new song
    console.log(`Now playing ${newSong.name}!`);
  } catch (error) {
    console.log(error);
    sendMessage(message.channel, "**An Error occurred!**");
  }
};