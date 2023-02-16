const fs = require("fs");

module.exports = (client, Discord) => {
  try {
    const load_dir = (dirs) => {
      const event_files = fs
        .readdirSync(`./events/${dirs}`)
        .filter((file) => file.endsWith(".js"));
      for (const file of event_files) {
        const event = require(`../events/${dirs}/${file}`);
        const event_name = file.split(".")[0];
        client.on(event_name, event.bind(null, client, Discord));
      }
    };

    ["client", "guild"].forEach((e) => load_dir(e));

    //do the same for player directory but do it on client.player.on
    // const load_player_dir = (dirs) => {
    //   const event_files = fs
    //     .readdirSync(`./events/${dirs}`)
    //     .filter((file) => file.endsWith(".js"));
    //   for (const file of event_files) {
    //     const event = require(`../events/${dirs}/${file}`);
    //     const event_name = file.split(".")[0];
    //     client.player.on(event_name, event);
    //   }
    // };
    // ["player"].forEach((e) => load_player_dir(e));

    client.player.on('songChanged', (queue, newSong, oldSong) => {
      console.log(`${newSong} is now playing.`)
    })
    client.player.on('songFirst', (queue, newSong, oldSong) => {
      console.log(`${newSong} is now playing.`)
    })
  } catch (error) {
    console.log(error);
  }
};