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
    for(var i=0; i<banned_word_list.length;i++){
      if(msg.content.includes(banned_word_list[i])){
        // message includes banned word, do something about that
        return true;
      }
    }
    return false;
  }
};
