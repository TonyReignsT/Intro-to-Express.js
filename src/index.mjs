import express from 'express';

const app = express()
const PORT = process.env.PORT || 3000;
app.use(express.json())

//Middleware
const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();  //function called when done with the middleware
}

//Initialize repetitve code
// Middleware
const resolveIndexByUserId = (req, res, next) => {
    const { params: { id } } = req;
    const parsedId = parseInt(id);
    
    if (isNaN(parsedId)) return res.sendStatus(400);
    
    const findUserIndex = users.findIndex((user) => user.id === parsedId);
    
    if (findUserIndex === -1) return res.sendStatus(404); //-1 means User not found
    req.findUserIndex = findUserIndex;
    next();
}


//Registering the middleware globally to be accessed by the request handlers
// app.use(loggingMiddleware);
//To log the middleware to specific req handler, you pass the middleware function as a parameter

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

//Request Handlers

// app.get('/', loggingMiddleware, (req, res)=> {}) or to have more control use the one below
// app.get('/', (req, res, next) => {
//     console.log("Base URL");
//     next();
// }, 

app.get('/',(req, res)=> {
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
app.get('/api/users', (req, res)=> {
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

//Get Request
app.get('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const {findUserIndex} = req;
    const findUser = users[findUserIndex];
    if (!findUser) return res.sendStatus(404);
    return res.send(findUser);
})

//Put Request
app.put('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req;
    users[findUserIndex] = { id: users[findUserIndex].id, ...body }; // Update the user
    return res.sendStatus(200);
});

//Patch Request
app.patch('/api/users/:id', resolveIndexByUserId, (req, res)=> {
    const {body, findUserIndex} = req;
    users[findUserIndex] = {...users[findUserIndex], ...body}
    return res.sendStatus(200);
})

//Delete Request
app.delete("/api/users/:id", resolveIndexByUserId, (req, res)=> {
    const {findUserIndex} = req;
    users.splice(findUserIndex, 1); //1 - specifies removing one element
    return res.sendStatus(200);
})


app.listen(PORT, ()=> {
    console.log(`Running on port ${PORT}`);
    
})
