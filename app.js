require('dotenv').config();
const Discord = require('discord.js');
const bp = require('./banned_phrases');
const bc = require('./bot_commands');

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]}); // create a new client

// LOGS THE BOT IN
const client_ready = client.on('ready', ()=>{
  // only accept commands when the client is ready
  // client connected
  console.log(`Logged in as ${client.user.tag}!`);
});


// HANDLE MESSAGES IN THE SERVER
client.on('messageCreate', async (msg)=>{
  // Checks each message sent from a user, if their message contains any of the banned phrases then they
  // are warned to change it.
  console.log(msg.flags);

  const msg_check = await bp.bannedPhrases(msg);
  if(msg_check){
    const msg_reply = {
      content:"Message contains banned phrase, please spoiler tag your message!",
      files: ["./img/caught.png"]
    };
    msg.reply(msg_reply);
  }

  // BOT COMMANDS
  const msg_command_reply = bc.botCommands(msg);
});




client.login(process.env.CLIENT_TOKEN); // enter token
