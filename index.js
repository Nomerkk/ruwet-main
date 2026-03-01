const Discord = require('discord.js-selfbot-v13');
const axios = require('axios');
const config = require('./config.json');
const express = require('express');
require('dotenv').config();

// Setup Express server for UptimeRobot
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

app.listen(PORT, () => {
  console.log(`🌐 Server is running on port ${PORT}`);
});

const STATUS_URL = "https://discordapp.com/api/v8/users/@me/settings";
const client = new Discord.Client({
  checkUpdate: false,
  ws: { properties: { browser: 'Discord iOS' } }
});

// Client Events
client.on("ready", async () => {
  console.log(`✅ ${client.user.username} Summoned`);
  client.user.setPresence({ status: 'online' });

  const { joinVoiceChannel } = require('@discordjs/voice');
  const channel = client.channels.cache.get("1452689202398498836");
  if (!channel) return console.log("The channel does not exist!");

  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfDeaf: true,
    selfMute: true
  });
  
  console.log("Connected to voice channel");
});

// Loop function to change Discord status
async function loop() {
  for (let anim of config.animation) {
    try {
      await doRequest(anim.text, anim.emojiID, anim.emojiName);
      await new Promise(p => setTimeout(p, anim.timeout));
    } catch (error) {
      console.error(error);
    }
  }
  setTimeout(loop, 1000); // Avoid stack overflow by not using recursion
}

// Send request to change status
async function doRequest(text, emojiID = null, emojiName = null) {
  try {
    const response = await axios.patch(STATUS_URL, {
      custom_status: {
        text,
        emoji_id: emojiID,
        emoji_name: emojiName
      }
    }, {
      headers: {
        Authorization: process.env.TOKEN
      }
    });

    if (response.status !== 200) {
      throw new Error("Invalid Status Code: " + response.status);
    }
  } catch (error) {
    throw error;
  }
}

console.log("Discord Status Changer is Running...");
client.login(process.env.TOKEN);
loop();
