require('dotenv').config();
const Discord = require('discord.js');
const bp = require('./bot_modules/banned_phrases');
const bc = require('./bot_modules/bot_commands');
const db = require('./dbtools/db_funcs');

const command_list = [
  '--show bp',
  '--remove bp',
  '--add bp'
];

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

  // check each message for a banned phrase
  if(checkCmdValidity(msg) == 0){
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
  if(msg.content.startsWith('--show bp')){
    // shows the banned phrases
    var res1 = await bc.handleShowBp(msg.guildId);
    msg.reply(res1);
    return;
  }
  else if(msg.content.startsWith('--add bp') && checkUserPerms(msg) == 0){
    // add new banned phrase(s)
    var res2 = await bc.handleAddBps(msg.content, msg.guildId);
    if(res2){
      var show_bp = await bc.handleShowBp(msg.guildId);
      msg.reply(show_bp);
      return;
    }else{
      msg.reply("Error adding please try again later.");
      return;
    }
    return;
  }
  else if(msg.content.startsWith('--remove bp') && checkUserPerms(msg) == 0){
    // remove banned phrase(s)
    var res3 = await bc.handleRemoveBp(msg.content, msg.guildId);
    if(res3){
      var show_bp = await bc.handleShowBp(msg.guildId);
      msg.reply(show_bp);
      return;
    }else{
      msg.reply("Error removing please try again later.");
      return;
    }
    return;
  }
  else if(msg.content.includes('--help')){
    // give the user documentation on how to use the
    // bot.
    msg.reply(`Documentation not yet written :(`);
  }else if(msg.content.includes('--clear bp') && checkUserPerms(msg) == 0){
    // clears all the banned phrases for the server.
    console.log("remove all");
  }
});


function checkUserPerms(msg){
  // if cmd was sent by server owner or a user with
  // a mod role, then success, cmd can be used, else
  // bad >:(
  if(msg.author.id == msg.guild.ownerId){
    return 0;
  }
  if(msg.member.roles.cache.some(role=>role.name === "mod")){
    return 0;
  }
  msg.reply("Sorry, only the server owner and people with the \`mod\` role can do this!");
  return 1;
}



function checkCmdValidity(msg){
  // not the bot sending the message and the msg contains a command
  if(msg.author.id == client.application.id){
    return 1;
  }

  // check if a cmd is actually included in the msg
  for(var i=0; i<command_list.length; i++){
    if(msg.content.includes(command_list[i])){
      // if the message contains the cmd, return 0
      return 1;
    }
  }
  return 0;
}


client.login(process.env.CLIENT_TOKEN); // enter token
