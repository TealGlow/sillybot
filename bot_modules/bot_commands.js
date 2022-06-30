/*
  Contains the function that deals with commands sent to the bot
*/

const db = require('../dbtools/db_funcs');
const cleaner = require('../user_input_cleaner');

exports.handleShowBp = async function(guildId){
  // handle showing bp for a guild.
  try{
    var res = await db.findByGuildId(guildId);

    if(res.length < 1){
      return(`There are no banned phrases for this server yet! \n\nYou can add some by using the command: \`\`\`--add bp [pharse here]\`\`\``);
    }else{
      console.log("got the banned words from the server", res);
      return(`Banned phrases for the server: \n\`\`\`- ${res.join("\n- ")}\`\`\``);
    }
  }catch(error){
    console.error(error);
    return false;
  }
}


exports.handleAddBps = async function(toAdd, guildId){
  // add new banned phrase.  First clean the user input so
  // that they cannot mess with the db, then split that string
  // into an array and finally use the function to add it to
  // the db based on the guild id.
  var words = toAdd.replace('--add bp', "");
  // cleaning the word list a little
  final_word_list = await cleaner.cleanUserInputIntoArray(words);

  if(final_word_list.length<1){
    // nothing added after the command, tell the user to
    return(`Please type the word to add.`);
  }else{
    // add the word to the db
    try{
      //var res = await db.findByGuildId(msg.guildId);
      var result = await db.upsertItemByGuildId(guildId, final_word_list);
      return result;
    }catch(error){
      console.error(error);
      // error on the db side.
      return false;
    }
  }
}


exports.handleRemoveBp = async function(toRemove, guildId){
  var words = toRemove.replace('--remove bp', "");
  // cleaning the word list a little
  final_word_list = await cleaner.cleanUserInputIntoArray(words);

  console.log(final_word_list);
  if(final_word_list.length<1){
    // nothing removed after the command, tell the user to
    return(`Please type the word to remove.`);
  }else{
    // remove the word from the db
    try{
      var result = await db.removeItemsInList(guildId, final_word_list);
      return result;
    }catch(error){
      console.error(error);
      // error on the db side.
      return false;
    }
  }
}

exports.handleClearBp = async function(guildId){
  try{
      var results = await db.clearBannedPhraseListForServer(guildId);
      return results;
  }catch(error){
    console.error(error);
    return false;
  }
}
