exports.botCommands = function(msg){
  // BOT COMMANDS
  if(msg.content.slice(0, 2) === "--"){
    // this is a command for our bot
    // want want to set this up so that they can only accept commands
    // and send replies to these commands in a certain channel.  this
    // will be its own bot channel
    switch(msg.content){
      case '--add thread':
        console.log("ADD THREAD")
        break;
    }

    const msg_body = msg.content.slice(2);
    console.log(msg_body);
    msg.reply("You entered a command, but commands do not work yet <3");
  }
};
