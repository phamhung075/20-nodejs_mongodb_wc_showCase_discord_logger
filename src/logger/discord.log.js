'use strict';

const { Client, GatewayIntentBits } = require('discord.js');
const {
    CHANNELID_DISCORD,
    TOKEN_DISCORD
} = process.env;
const client = new Client({ 
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(TOKEN_DISCORD);

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (message.content === 'ping') {
        message.reply('pong');
    }
});