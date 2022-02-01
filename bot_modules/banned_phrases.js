/*
  Contains a function that recieves a message object from the discord server and
  determines if the message contains a banned word from a list of banned words

  todo:
  - determine if the banned word is under a spoiler tag, if so do not warn the person
  - attach this to a DB so that it is per server and not the same list of words
  this means that there should also be a command to add and remove an item from
  the list in the commands
*/
//const mongo = require("mongodb");

exports.bannedPhrases = function(msg){
  function checkSpoilerTags(m){
    // check if the message sent is under a spoiler tag, we do not want to give a warning
    // if they properly spoiler tagged

    // we don't want to send this message to the user if they already have their message spoiler tagged.
    if(m.slice(0,2)=="||" && m.slice(-2)=="||"){
      return true;
    }else{
      return false;
    }
  }

  // if it is not spoiler tagged, then we are going to check for a banned phrase
  if(!checkSpoilerTags(msg.content)){
    const banned_word_list = ["vomit", "throw up", "vom", "puke", "puking", "puked", "threw up"];

    // storing this for checking the db on banned word list later
    const guildId = msg.guildId;
    const channelId = msg.channelId;

    for(var i=0; i<banned_word_list.length;i++){
      if(msg.content.includes(banned_word_list[i])){
        // message includes banned word, do something about that
        return true;
      }
    }
    return false;
  }
};
