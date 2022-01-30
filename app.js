require('dotenv').config();
const Discord = require('discord.js');

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]}); // create a new client

const client_ready = client.on('ready', ()=>{
  // only accept commands when the client is ready
  // client connected
  console.log(`Logged in as ${client.user.tag}!`);
});


// handle messages
client.on('messageCreate', async (msg)=>{
  // scrub banned words from the server
  const banned_word_list = ["vomit", "throw up", "vom", "puke", "puking", "puked", "threw up"]
  console.log(msg.channelId);
  for(var i=0; i<banned_word_list.length;i++){
    if(msg.content.includes(banned_word_list[i])){
      // message includes banned word, do something about that
      console.log("hit!");

      const msg_reply = {
        content:"Message contains banned phrase, please spoiler tag your message!",
        files: ["./img/caught.png"]
      }
      /*msg.reply("Message contains banned phrase, please spoiler tag your message!");
      msg.channel.send({
        files: ["./img/caught.png"]
      });
      msg.channel.send("NOW!");*/
      msg.reply(msg_reply);
      return;
    }
  }

  if(msg.content.slice(0, 2) === "--"){
    // this is a command for our bot
    const msg_body = msg.content.slice(2);
    console.log(msg_body);
  }else{
    // do nothing with the bot
  }

});




client.login(process.env.CLIENT_TOKEN); // enter token
