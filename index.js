const express = require('express')
const Datastore = require('nedb-promise')

const app = express()


const PORT = 8000
const URL = '127.0.0.1'

app.use(express.json())

const db = new Datastore({filename: 'personer.db', autoload: true})

const server = app.listen(PORT, URL, () =>{
    console.log(`listening to port ${PORT}`)
})


app.get('/', (req,res) => {
    res.send(`hello there`)
})


app.post('/persons', async (req,res) =>{
    const {name, age, friends} = req.body;
    const newPerson = {name, age, friends}

    try{
       const person = await db.insert(newPerson)
       res.status(201).json(person)     
    }catch(e){
        res.status(500).send("internal server error")
    }

})


app.get('/persons', async (req,res) =>{
    try{
        const persons = await db.find({})
        res.status(201).json(persons)

    } catch(e){
        res.status(500).send("server go boom")
    }

})

app.get('/persons/:id', async (req,res) =>{
    const id = req.params.id
    try{
        const person = await db.findOne({_id: id}, (error, doc) =>{
            if(error) {
                res.status(404).send("person not found")
            }
            return doc
        } ) 
        if(!person){
            res.status(404).send("no person with that id found")
            return
        }
        res.json(person)
    }catch(e){
        res.status(500).send("server go boom")
    }
})

app.delete('/persons/:id', async (req,res) =>{
    const id = req.params.id

    try{
         const numRemoved =  db.remove({_id : id}, {})
        if(numRemoved === 0){
            res.status(404).send("person not found")
            return
        } 
        res.sendStatus(200);
       
            
    }catch(e){
        res.status(500).send("server go boom")
    }
})

app.put('/persons/:id', async (req,res) =>{
    const id = req.params.id
    const updateFields = {}
    if (req.body.name) updateFields.name = req.body.name
    if (req.body.age) updateFields.age = req.body.age
    if (req.body.friends) updateFields.friends = req.body.friends

    try{
      await db.update({_id: id}, {$set: updateFields}, {})
        res.sendStatus(201)
    }catch(e){
        res.status(500).send("server error")
    }

})

app.put('/persons/:id/addFriend/:friendId', async (req,res) => {

    const personId = req.params.id
    const friendId = req.params.friendId

   
    try{
        const person = await db.findOne({_id: personId},(error, doc) =>{
            if(error) {
                res.status(404).send("person not found")
            }
            return doc
        })

        //denna använde vi när vi ville stoppa in ett helt person objekt i [friends]
        // const friend = await db.findOne({_id: friendId}, (error, doc) =>{
        //     if(error) {
        //         res.status(404).send("person not found")
        //     }
        //     return doc
        // })

        if(!person.friends.find(f => f._id === friendId)){
            person.friends.push(friendId)       //detta var push(friend) innan vi gjorde om metoden till att bara lagra _id i [friends]
            await db.update({_id: person._id}, { $set: {friends: person.friends}})
            res.status(200).send("updated friendlist")

        } else {
            res.status(400).send("vi hade redan en kompis")
        }
    } catch(e){
        res.status(500).send("???")
    }
})


// ACID

// Atomic
// Consistency
// Isolation
// Durability

// CRUD // Create = insert = post, Read = find = get, Update = update = put, Delete = remove = delete

//person {
//  _id: stirng, 
// name: string,
// age: number,
// friends: [Person] 
//}
