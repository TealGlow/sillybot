require('dotenv').config();
const Discord = require('discord.js');
const bp = require('./bot_modules/banned_phrases');
const bc = require('./bot_modules/bot_commands');
const db = require('./dbtools/db_funcs');

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]}); // create a new client

// LOGS THE BOT IN
const client_ready = client.on('ready', ()=>{
  // only accept commands when the client is ready
  // client connected
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on("guildCreate", (guild)=>{
  // on bot server join

  // TODO: when bot joins a server we are going to create a new item in the db
  // with an empty array for banned phrases
  console.log(`Joined new guild ${guild.name}`);
  try{
    db.createNewServerList();
    console.log(`New banned phrase list init`);
  }catch(error){
    console.error(error);
  }
});


// HANDLE MESSAGES IN THE SERVER
client.on('messageCreate', async (msg)=>{
  // Checks each message sent from a user, if their message contains any of the banned phrases then they
  // are warned to change it.

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
