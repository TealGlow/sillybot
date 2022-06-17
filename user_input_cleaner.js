// function for cleaning user input
exports.cleanUserInputIntoArray = async function(toClean){
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
