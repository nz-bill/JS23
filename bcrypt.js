const bcrypt = require('bcryptjs');

async function hashPassword(password){
const encryptedPassword = await bcrypt.hash(password, 10);

//console.log(`hashed password ${encryptedPassword}`);

//console.log(`salt : ${bcrypt.getSalt(encryptedPassword)}` )

    return encryptedPassword;
}

async function comparePassword(password, hashedPassword){
   const passwordMatches = await bcrypt.compare(password, hashedPassword)
   return passwordMatches
}


module.exports = {hashPassword, comparePassword}