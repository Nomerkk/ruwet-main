const Discord = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
require('dotenv').config();

const client = new Discord.Client({
  checkUpdate: false
});

// Client Events
client.on("ready", async () => {
  console.log(`✅ ${client.user.username} Summoned`);
  
  // Konfigurasi Activity standar (Bukan custom RichPresence)
  // Ini akan memicu deteksi game asli bawaan Discord
  client.user.setActivity({
    name: 'LEGO Batman: Legacy of the Dark Knight',
    type: 'PLAYING',
    applicationId: '1501422042904395827',
    timestamps: {
      start: Date.now()
    }
  });
  client.user.setPresence({ status: 'idle' }); // 'online', 'idle', 'dnd', 'invisible'

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
