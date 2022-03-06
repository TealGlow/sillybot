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


exports.handleAddBps = async function(toAdd, guildId){
  // add new banned phrase.  First clean the user input so
  // that they cannot mess with the db, then split that string
  // into an array and finally use the function to add it to
  // the db based on the guild id.
  var words = toAdd.replace('--add bp', "");
  // cleaning the word list a little
  final_word_list = await cleanUserInputIntoArray(words);

  if(final_word_list.length<1){
    // nothing added after the command, tell the user to
    return(`Please type the word to add.`);
  }else{
    // add the word to the db
    try{
      //var res = await db.findByGuildId(msg.guildId);
      var result = await db.upsertItemByGuildId(guildId, final_word_list);
      if(result){
        return(`Successfully added word(s) to banned phrases list. \nSee banned phrases using this command: \`\`\`--show bp\`\`\``);
      }else{
        // some sort of error on the db side
        return(`Error adding word(s) to banned phrases list, please try again or check the documentation.`);
      }
    }catch(error){
      console.error(error);
      // error on the db side.
      return(`Error adding word(s) to banned phrases list, please try again or check the documentation. 2`);
    }
  }
}


exports.handleRemoveBp = async function(toRemove, guildId){
  var words = toRemove.replace('--remove bp', "");
  // cleaning the word list a little
  final_word_list = await cleanUserInputIntoArray(words);

  console.log(final_word_list);
  if(final_word_list.length<1){
    // nothing removed after the command, tell the user to
    return(`Please type the word to remove.`);
  }else{
    // remove the word from the db
    try{
      var result = await db.removeItemsInList(guildId, final_word_list);
      if(result){
        return(`Successfully removed word(s) from the banned phrases list. \nSee banned phrases using this command: \`\`\`--show bp\`\`\``);
      }else{
        // some sort of error on the db side
        return(`Error removing word(s) from banned phrases list, please try again or check the documentation.`);
      }
    }catch(error){
      console.error(error);
      // error on the db side.
      return(`Error removing word(s) from banned phrases list, please try again or check the documentation.`);
    }
  }
}

const cleanUserInputIntoArray = async function(toClean){
  var word_list = toClean.split(',');
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
  return final_word_list
}
