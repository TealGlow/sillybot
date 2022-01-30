exports.bannedPhrases = function(msg){
  const banned_word_list = ["vomit", "throw up", "vom", "puke", "puking", "puked", "threw up"];
  for(var i=0; i<banned_word_list.length;i++){
    if(msg.content.includes(banned_word_list[i])){
      // message includes banned word, do something about that
      return true;
    }
  }
  return false;
};
