require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
    ],
});

const NOTIF_CHANNEL_ID = process.env.NOTIF_CHANNEL_ID;

client.once('ready', () => {
    console.log(`Bot online sebagai ${client.user.tag}`);
});

client.on('voiceStateUpdate', (oldState, newState) => {
    const member = newState.member;
    const notifChannel = newState.guild.channels.cache.get(NOTIF_CHANNEL_ID);

    if (!notifChannel) return;

    if (!oldState.channelId && newState.channelId) {
        notifChannel.send(`🔊 **${member.user.tag}** telah join voice @everyone **#${newState.channel.name}**`);
    } else if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
        notifChannel.send(`🔀 **${member.user.tag}** pindah dari **#${oldState.channel.name}** ke **#${newState.channel.name}**`);
    } else if (oldState.channelId && !newState.channelId) {
        notifChannel.send(`📤 **${member.user.tag}** telah leave voice **#${oldState.channel.name}**`);
    }
});

client.login(process.env.DISCORD_TOKEN);
