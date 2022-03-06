require('dotenv').config();
const Discord = require('discord.js');
const bp = require('./bot_modules/banned_phrases');
const bc = require('./bot_modules/bot_commands');
const db = require('./dbtools/db_funcs');

// create a new Discord Client
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

// LOGS THE BOT IN
const client_ready = client.on('ready', ()=>{
  // only accept commands when the client is ready
  // client connected
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on("guildCreate", (guild)=>{
  // on bot server join

  // when bot joins the server it initializes the banned
  // phrase list to empty and adds the guild id to the
  // mongodb
  console.log(`Joined new guild ${guild.name}`);
  try{
    console.log(db.createNewServerList(guild.id));
    console.log(`New banned phrase list init`);
  }catch(error){
    console.error(error);
  }
});


// HANDLE MESSAGES IN THE SERVER
client.on('messageCreate', async (msg)=>{
  // Checks each message sent from a user, if their message contains any of the banned phrases then they
  // are warned to change it.

  if(msg.author.id != client.application.id && !msg.content.includes('--add bp') && !msg.content.includes('--remove bp') && !msg.content.includes('--show bp')){
    try{
      var res = await db.findByGuildId(msg.guildId);
      const msg_check = await bp.bannedPhrases(msg, res);
      if(msg_check){
        const msg_reply = {
          content:"Message contains banned phrase, please spoiler tag your message!",
          files: ["./img/caught.png"]
        };
        msg.reply(msg_reply);
      }
    }catch(error){
      console.error(error);
    }
  }

  // BOT COMMANDS
  if(msg.content == '--show bp'){
    // shows the banned phrases
    var res1 = await bc.handleShowBp(msg.guildId);
    msg.reply(res1);
    return;
  }
  else if(msg.content.startsWith('--add bp')){
    // add new banned phrase(s)
    var res2 = await bc.handleAddBps(msg.content, msg.guildId);
    msg.reply(res2);
    return;
  }else if(msg.content.includes('--remove bp')){
    // remove banned phrase(s)
    var res3 = await bc.handleRemoveBp(msg.content, msg.guildId);
    msg.reply(res3);
    return;
  }
});




client.login(process.env.CLIENT_TOKEN); // enter token
