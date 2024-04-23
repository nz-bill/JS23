const db = require('./userDb')
const {Router} = require('express')
const {hashPassword, comparePassword} = require('./bcrypt')
const jwt = require('jsonwebtoken')

const router = Router()

router.post('/register', async (req,res) =>{
    const { username, password } = req.body;

    const user = await db.getUser(username)
    if(user){
        res.status(418).send("username unavailable")
        return
    }
    const encryptedPassword = await hashPassword(password)

    db.storeUser(username, encryptedPassword)

    res.send("new user registered")

})

router.post('/login', async (req,res) =>{
    const {username, password } = req.body;

    const user = await db.getUser(username)

    if(user == null){
        res.status(404).send("user not found")
        return
    }
    const correctPassword = await comparePassword(password, user.password)
    console.log(correctPassword)
    if(correctPassword){
            const token = jwt.sign({id: user._id, role: "admin" }, "process.env.JWT_SECRET", {expiresIn: 600})
            let result = {
                token: token
            }

            res.json(result)
    } else {
        res.status(401).send("wrong password")
    }
    

})

router.get('/users', async (req,res) =>{
    const token = req.headers.authorization;

    try{
        const data = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET)
        console.log(data)
        const users = await db.getAllUsers()
        res.json(users)

    } catch(error){
        res.status(401).send("invalid token")
    }

})

module.exports = router;