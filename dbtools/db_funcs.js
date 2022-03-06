require('dotenv').config();
const { MongoClient } = require('mongodb');
const url = process.env.BOT_DB_URL;

// CREATE READ UPDATE DELETE - CRUD
const Client = new MongoClient(url);
const myDb = Client.db("sillybotdb").collection("sillybot");

/*
CRUD operations from the official mongodb website:
https://www.mongodb.com/developer/quickstart/node-crud-tutorial/?utm_campaign=nodejsdeletedocuments&utm_source=facebook&utm_medium=organic_social
*/
/*
async function main(){

  try{
    // connect to the db
    await Client.connect();
    // do stuff to db here
    //await deleteListingByGuildId(myDb, "temp")
  }catch(error){
    console.error(error)
  }finally{
    // close connection to db
    await Client.close();
  }

}

main().catch(console.error);*/

/*
      CREATE
*/
// INSERT ONE ITEM

const createNewServerList = async function (guildId){
  // exporting the ability to insert a new item into the server so that
  // when a guild joins a server it is automatically added to the collection

  let success = false;
  try{
    // connect to the db
    await Client.connect();
    await upsertBannedPhrasesByGuildId(myDb, guildId, {bannedPhrases:[]});
    success = true;
  }catch(error){
    console.error(error);
    return false;
  }finally{
    // close connection to db
    await Client.close();
    return success;
  }
}
// export this function
exports.createNewServerList = createServerList;

async function createServerList(myDb, guildId){
  /*
  CRUD operations from the official mongodb website:
  https://www.mongodb.com/developer/quickstart/node-crud-tutorial/?utm_campaign=nodejsdeletedocuments&utm_source=facebook&utm_medium=organic_social
  */

  const result = await myDb.insertOne({guildId:guildId, bannedPhrases:[]});
  console.log(`New server with guildId: ${guildId} created with the following id: ${result.insertedId}`);
}

// INSERT MANY ITEMS
async function createManyServerLists(myDb, toInsert){
  /*
  CRUD operations from the official mongodb website:
  https://www.mongodb.com/developer/quickstart/node-crud-tutorial/?utm_campaign=nodejsdeletedocuments&utm_source=facebook&utm_medium=organic_social
  */

  const result = await myDb.insertMany(toInsert);
  console.log(`${result.insertedCount} new guilds added with the following id(s):`);
  console.log(result.insertedIds);
}



/*
      READ
*/

exports.findByGuildId = async function(guildId){
  let success = false;
  try{
    // connect to the db
    await Client.connect();
    success = await findOneGuildListById(myDb, guildId);
  }catch(error){
    console.error(error);
  }finally{
    // close connection to db
    await Client.close();
    return success;
  }
}

exports.upsertItemByGuildId = async function(guildId, toAdd){
  let success = false;
  try{
    // connect to the db
    await Client.connect();
    //success = await upsertBannedPhrasesByGuildId(myDb, guildId, {bannedPhrases:toAdd});
  }catch(error){
    console.error(error);
    return false;
  }finally{
    // close connection to db
    await Client.close();
    return success;
  }
}

/*exports.removeItemsInList = async function(guildId, toRemove){
  let success = false;
  try{
    // connect to the db
    await Client.connect();
    success = await deleteListingByGuildId(myDb, guildId, {bannedPhrases:toRemove});
  }catch(error){
    console.error(error);
  }finally{
    // close connection to db
    await Client.close();
    return success;
  }
}*/

// READ ONE ITEM (SEARCH FOR ONE ITEM)
async function findOneGuildListById(myDb, guildId){
  /*
  CRUD operations from the official mongodb website:
  https://www.mongodb.com/developer/quickstart/node-crud-tutorial/?utm_campaign=nodejsdeletedocuments&utm_source=facebook&utm_medium=organic_social
  */

  const result = await myDb.findOne({guildId:guildId});
  if(result){
    console.log(`Found a Guild with that id: ${guildId}`);
    return(result.bannedPhrases);
  }else{
    console.log("Did not find a Guild with that id.");
    const result = await createNewServerList(guildId);
    return([]);
  }
}

// READ ALL ITEMS WITH ID
async function findAllGuildListById(myDb, guildId){
  /*
  CRUD operations from the official mongodb website:
  https://www.mongodb.com/developer/quickstart/node-crud-tutorial/?utm_campaign=nodejsdeletedocuments&utm_source=facebook&utm_medium=organic_social
  */

  const result = await myDb.find({guildId:guildId}).toArray();
  if(result){
    console.log(`Found Guild(s) with that id: ${guildId}`);
  }else{
    console.log("Did not find a Guild with that id");
    const result = await createNewServerList(guildId);
    return([]);
  }
}

/*
      UPDATE
*/
async function upsertBannedPhrasesByGuildId(myDb, guildIdToUpdate, toAdd){
  /*
  CRUD operations from the official mongodb website:
  https://www.mongodb.com/developer/quickstart/node-crud-tutorial/?utm_campaign=nodejsdeletedocuments&utm_source=facebook&utm_medium=organic_social
  */

  // add the new item to the guildId's bannedPharases list, if the item already exists do nothing
  // if the guild does not exist, add it to the db
  console.log("toAdd here", toAdd);
  const result = await myDb.updateOne({guildId:guildIdToUpdate}, {$addToSet:{bannedPhrases:{$each:toAdd.bannedPhrases}}}, {upsert:true});
  console.log(`${result.matchedCount} guildIds matched query criteria`);

  if(result.upsertedCount>0){
    console.log(`One guild was inserted with the guildid:${guildIdToUpdate} and db id: ${result.upsertedId}`);
    return false;
  }else{
    console.log(`${result.modifiedCount} bannedPhrases list(s) updated`);
    return true;
  }
}


/*
      DELETE
*/

async function deleteListingByGuildId(myDb, guildIdToDelete){
  const result = await myDb.deleteOne({guildId:guildIdToDelete});

  console.log(`${result.deletedCount} guild(s) deleted.`);
}

/*async function deleteItemsByGuildId(myDb, guildId, toRemove){
  const result = await myDb.update({guildId:guildId},{$pull:{bannedPhrases:{$each:toRemove.bannedPhrases}}});
  console.log(`Deleted items in arr.`)
}*/
