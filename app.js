require('dotenv').config();
const Discord = require('discord.js');
const bp = require('./bot_modules/banned_phrases');
const bc = require('./bot_modules/bot_commands');
const db = require('./dbtools/db_funcs');

// create a new Discord Client
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});
const bot_id = "891484880695857162";
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

  if(msg.author.id != bot_id && !msg.content.includes('--add bp')){
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
    var res = await bc.handleShowBp(msg.guildId);
    if(res){
      msg.reply(res);
    }else{
      console.log("error");
    }
  }
  else if(msg.content.includes('--add bp')){
    // add new banned phrase.  First clean the user input so
    // that they cannot mess with the db, then split that string
    // into an array and finally use the function to add it to
    // the db based on the guild id.
    var words = msg.content.replace('--add bp', "");
    // cleaning the word list a little
    var word_list = words.split(',');
    var final_word_list=[]

    for(var i=0; i<word_list.length; i++){
      // remove leading spaces if so
      word_list[i] = word_list[i].trim();
      // add all words to lowercase, check all banned words at lowercase
      word_list[i] = word_list[i].replaceAll(/[|&;$%@"<>()+#!,]/g, "").toLowerCase();
      if(word_list[i].length>0){
        // if the word still exists after being stripped,
        // it is added to result array final_word_list
        final_word_list.push(word_list[i]);
      }
    }
    if(final_word_list.length<1){
      // nothing added after the command, tell the user to
      msg.reply(`Please type the word to add.`);
    }else{
      // add the word to the db
      console.log(final_word_list)
      try{
        //var res = await db.findByGuildId(msg.guildId);
        var result = await db.upsertItemByGuildId(msg.guildId, final_word_list);
        if(result){
          msg.reply(`Successfully added word(s) to banned phrases list. Please use the --show bp command to see them!`);
        }else{
          // some sort of error on the db side
          msg.reply(`Error adding word(s) to banned phrases list, please try again or check the documentation.`);
        }
      }catch(error){
        console.error(error);
        // error on the db side.
        msg.reply(`Error adding word(s) to banned phrases list, please try again or check the documentation.`);
      }
    }
  }else if(msg.content.includes('--remove bp')){
    // stuff here
    console.log("remove");
  }
});




client.login(process.env.CLIENT_TOKEN); // enter token
