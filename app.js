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

  //const msg_check = await bp.bannedPhrases(msg);
  if(msg.author.id != "891484880695857162"){
    try{
      var res = await db.findByGuildId(msg.guildId);
      //console.log(res);
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
  switch(msg.content){
    case '--show bp':
      // SHOW BANNED PHRASES FOR THE SERVER
      try{
        var res = await db.findByGuildId(msg.guildId);

        if(res.length < 1){
          msg.reply(`There are no banned phrases for this server yet! \n\nYou can add some by using the command: \`--add bp 'pharse here'\``);
        }else{
          console.log(res);
          msg.reply(`Banned phrases for the server: \n\`\`\`- ${res.join("\n- ")}\`\`\``);
        }
      }catch(error){
        console.error(error);
        break;
      }
      break;
  }
});




client.login(process.env.CLIENT_TOKEN); // enter token
