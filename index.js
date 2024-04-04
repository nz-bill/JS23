var express = require('express');


var app = express()

app.use(express.static(__dirname +"/public" ))

const PORT = 8000
const URL = '127.0.0.1'

app.use(express.json())


var server = app.listen( PORT, URL, () => {
    var host = server.address().address
    var port = server.address().port

    console.log(`server running at http://${host}:${port}`);
})


var employees = [
    {
        "name": "Bill",
        "age" : 43,
        "salary": 100,
        "id" : 1
    },
    {
        "name": "Bosse",
        "age" : 23,
        "salary": 200,
        "id" : 2
    },
    {
        "name": "Banarne",
        "age" : 80,
        "salary": 0,
        "id" : 3
    }

]

// CRUD Create = Post, Read = Get, Update = Put, Delete = delete


app.get('/', (req,res) => {
    let url = __dirname + "\\page.html"
    res.sendFile(url)
})
//alt:
// app.get('/', (req,res) => { 
//    res.sendFile('./page.html', { root: __dirname })
// })

app.get('/employees', (req,res) =>{
    res.send(JSON.stringify(employees) )
})

app.get('/employees/:id', (req,res) =>{
    for(let i = 0; i < employees.length; i++){
        if(employees[i].id == req.params.id){
            res.json(employees[i])
           return
        }
    }
    res.status(404).send("employee not found")
})

app.get('/employees2/:id', (req,res) =>{
    let employee = employees.find( emp => emp.id == req.params.id) 
  
    if(employee){
        res.json(employee)
    } else{
        res.status(404).send("employee not found")
    }
})

app.get('/employees3', (req,res) =>{
    let employee = employees.find( emp => emp.id == req.query.id) 

    if(employee){
        res.json(employee)
    } else{
        res.status(452).send("employee not found")
    }

})

app.post('/employees', async (req,res) => {

    let id = await getNewId()
    var newEmployee = {
        "id": id,
        "name": req.body.name,
        "age" : req.body.age,
        "salary" : req.body.salary
    }

    employees.push(newEmployee)
    res.status(201).json(newEmployee)

})

app.put('/employees/:id', (req,res) =>{
    let employee = employees.find( emp => emp.id == req.params.id) 

    if(!employee){
        res.status(404).send("user not found")
        return
    } else{
        // if(req.query.name){
        //     employee.name = req.query.name
        // }
        
        //result = condition ? value1 : value2;
        employee.name  = req.query.name ? req.query.name : employee.name

        if(req.query.age){
            employee.age = req.query.age
        }
    
        if(req.query.salary){
            employee.salary = req.query.salary
        }
        res.json(employee)

    }
})

app.put('/employees2/:id', (req,res) =>{
    let employee = employees.find( emp => emp.id == req.params.id) 

    if(!employee){
        res.status(404).send("user not found")
        return
    } else{
        // if(req.body.name){
        //     employee.name = req.body.name
        // }
        
        //result = condition ? value1 : value2;
        employee.name  = req.body.name ? req.body.name : employee.name

        if(req.body.age){
            employee.age = req.body.age
        }
    
        if(req.body.salary){
            employee.salary = req.body.salary
        }
        res.json(employee)

    }
})

app.delete('/employees/:id', (req,res) =>{
    let newArray = employees.filter(emp => emp.id != req.params.id)

    if(newArray.length == employees.length){
        res.status(404).send("id not found")
        return
    }

    employees = newArray

    res.send("employee deleted")
})


function getNewId(){
    var highestId = employees.reduce((maxId, employee) => {
        return Math.max(maxId, employee.id)
    }, 0)

    return highestId + 1

}






