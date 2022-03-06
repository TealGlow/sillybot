/*
  Contains the function that deals with commands sent to the bot
*/

const db = require('../dbtools/db_funcs');

exports.handleShowBp = async function(guildId){
  // handle showing bp for a guild.
  try{
    var res = await db.findByGuildId(guildId);

    if(res.length < 1){
      return(`There are no banned phrases for this server yet! \n\nYou can add some by using the command: \`--add bp 'pharse here'\``);
    }else{
      console.log("got the banned words from the server",res);
      return(`Banned phrases for the server: \n\`\`\`- ${res.join("\n- ")}\`\`\``);
    }
  }catch(error){
    console.error(error);
    return false;
  }
}
