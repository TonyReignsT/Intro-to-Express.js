import express from 'express';

const app = express()
const PORT = process.env.PORT || 3000;
app.use(express.json())


const users = [
    {id: 1, username: "tony", displayName: "Tony"},
    {id: 2, username: "rob", displayName: "Rob"},
    {id: 3, username: "jermaine", displayName: "Jermaine"},
    {id: 4, username: "michael", displayName: "Michael"},
    {id: 5, username: "nathalie", displayName: "Nathalie"},
    {id: 6, username: "thuso", displayName: "Thuso"},
    {id: 7, username: "ciftler", displayName: "Ciftler"},
    {id: 8, username: "adeola", displayName: "Adeola"}
]
app.get('/', (req, res)=> {
    res.status(201).send({msg:"Hello World!!"});
})

app.get('/api/users', (req, res)=> {
    res.send(users);
});

app.get('/api/products', (req, res)=> {
    res.send([
        {id: 123, name: "Chicken breast", price: 12.99}
    ])
})

//Route Params
app.get('/api/users/:id', (req, res)=> {
    console.log(req.params); //Comes as string
    const parsedId = parseInt(req.params.id);

    if (isNaN(parsedId))
        return res.status(400).send({msg: "Bad request. Invalid ID."});

    const findUser = users.find((user) => user.id === parsedId);

    if (!findUser) return res.sendStatus(404);

    return res.send(findUser);
});

//Query Params
app.get('api/users', (req, res)=> {
    console.log(req.query);
    const {query: {filter, value}} = req;

    //Check if filter and value are provided
    if (filter && query) {
        const filteredUsers = users.filter(user => user[filter] && user[filter].includes(value));
        return res.send(filteredUsers);
    }
    return res.send(users); 
})

//Post Request
app.post('/api/users', (req, res)=> {
    console.log(req.body);
    const {body} = req;
    const newUser = {id: users[users.length -1].id + 1, ...body};
    users.push(newUser);
    return res.status(201).send(newUser);
})

//Put Request
app.put('/api/users/:id', (req, res)=> {
    const {body, params: {id}} = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);
    const findUserindex = users.findIndex((user) => user.id === parsedId);

    if (findUserindex === -1) return res.sendStatus(404);   //-1 means if the user is not found by id
    users[findUserindex] = {id: parsedId, ...body};  //updating the entire resource
    return res.sendStatus(200);
});

//Patch Request
app.patch('/api/users/:id', (req, res)=> {
    const {body, params: {id}} = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);
    const findUserindex = users.findIndex((user) => user.id === parsedId);
    if (findUserindex === -1) return res.sendStatus(404);   //-1 means if the user is not found by id
    users[findUserindex] = {...users[findUserindex], ...body}
    return res.sendStatus(200);
})

//Delete Request
app.delete("/api/users/:id", (req, res)=> {
    const {params : {id}} = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);
    const findUserIndex = users.findIndex((user)=> user.id === parsedId);
    if (findUserIndex === -1) return res.sendStatus(404);
    users.splice(findUserIndex, 1);
    return res.sendStatus(200);
})


app.listen(PORT, ()=> {
    console.log(`Running on port ${PORT}`);
    
})
