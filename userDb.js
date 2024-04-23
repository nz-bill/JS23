const nedb = require('nedb-promise');

const db = new nedb({filename: 'users.db', 
autoload: true});

function storeUser(username, password){
    db.insert({username: username, 
        password: password});
}

function getUser(username){
    return db.findOne({username: username})

}

function getAllUsers(){
    return db.find({})
}


module.exports = {storeUser, getUser, getAllUsers}