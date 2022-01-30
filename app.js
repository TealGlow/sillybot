require('dotenv').config();
const Discord = require('discord.js');
const bp = require('./banned_phrases');

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

  // we don't want to send this message to the user if they already have their message spoiler tagged.

  function checkSpoilerTags(m){
    if(m.slice(0,2)=="||" && m.slice(-2)=="||"){
      return true;
    }else{
      return false;
    }
  }

  if(checkSpoilerTags(msg.content) == false){
    const msg_check = await bp.bannedPhrases(msg);
    if(msg_check){
      const msg_reply = {
        content:"Message contains banned phrase, please spoiler tag your message!",
        files: ["./img/caught.png"]
      };
      msg.reply(msg_reply);

    }
  }


  // BOT COMMANDS
  if(msg.content.slice(0, 2) === "--"){
    // this is a command for our bot
    // want want to set this up so that they can only accept commands
    // and send replies to these commands in a certain channel.  this
    // will be its own bot channel
    const msg_body = msg.content.slice(2);
    console.log(msg_body);
    msg.reply("You entered a command, but commands do not work yet <3")
  }

});




client.login(process.env.CLIENT_TOKEN); // enter token
