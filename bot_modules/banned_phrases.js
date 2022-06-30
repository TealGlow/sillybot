/*
  Contains a function that recieves a message object from the discord server and
  determines if the message contains a banned word from a list of banned words
*/

exports.bannedPhrases = function(msg, banned_word_list){

  // if it is not spoiler tagged, then we are going to check for a banned phrase

  // storing this for checking the db on banned word list later
  const guildId = msg.guildId;
  const channelId = msg.channelId;

  // remove everything from the spoiler tags from the string to check
  let rm = msg.content.replaceAll(/(?<=\|\|)(.*?)(?=\|\|)/gmi, "").toLowerCase();
  rm = rm.replaceAll("||", ""); // also remove the symbols

  if(rm.length > 0){
    for(var i=0; i<banned_word_list.length; i++){
      console.log(rm);
      if(rm == banned_word_list[i]){
        // message includes banned word, do something about that
        return true;
      }
    }
  }
  return false;
};
