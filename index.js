const Discord = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
require('dotenv').config();

const client = new Discord.Client({
  checkUpdate: false,
  ws: { properties: { browser: 'Discord iOS' } }
});

// Client Events
client.on("ready", async () => {
  console.log(`✅ ${client.user.username} Summoned`);
  client.user.setPresence({ status: 'online' });

  joinChannelLoop();
});

async function joinChannelLoop() {
  const channel = client.channels.cache.get('1452689202398498836');
  
  if (!channel) {
    console.log("The channel does not exist!");
  } else {
    try {
      joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: true,
        selfMute: true
      });
      console.log("Connected to voice channel");
    } catch (error) {
      console.error("Error joining voice channel:", error.message);
    }
  }

  // Loop ulang setiap 600000 ms (10 menit)
  setTimeout(joinChannelLoop, 600000);
}

console.log("Bot is Running...");
client.login(process.env.TOKEN);
