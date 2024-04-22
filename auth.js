const express = require('express');
const bodyParser = require('body-parser');
const {getUsers, addUsers, saveUsers, verifyCredentials} = require('./handleUserFunctions');
let users = require('./users.json');
const {generateToken, authorizeUser, getTokens, addTokens, saveTokens} = require('./handleAuthFunction')
let tokens = require('./tokens.json');

const app = express();
app.use(bodyParser.json());

const PORT = 2090;

app.get('/', (req, res)=> {
    const userList = getUsers();
    if(userList){
        res.status(200).json({ users: userList });
    }else{
        res.status(400).json({message: "UserList not found"})
    }
    
});

//let tokens = []
let verificationResponse = null;

app.post('/login', (req, res) =>{
    const {username, password} = req.body;
    verificationResponse = verifyCredentials(username,password);
    const test = typeof(verificationResponse);
    console.log(test);
    console.log(verificationResponse);

    if(verificationResponse == null){
        res.status(400).send("Invalid Credentials");
    }else{
        const token = generateToken(32);
        const tokenStatus = addTokens(token, verificationResponse);
        if(tokenStatus == "success"){
            const listOfTokens = getTokens();
            console.log(listOfTokens);
        res.status(200).json({"message":"Succesfully verified", "token": token});
        }   
    }
});

app.post('/registerUsers',(req, res) =>{
    const {username, email, password} = req.body;
    console.log(username, email, password);
    const status = addUsers(username, email, password);
    if(status == "success"){
        res.status(200).json({'message':'User successfully added'});
        res.send(users);
    }
    res.send(users);
});


app.delete('/deleteUser', (req,res)=>{
    const users = getUsers();
    users.splice(0, 1)
    saveUsers(users);
    res.status(200).send(users);
})

app.get('/resource', authorizeUser, (req, res) => {
    res.json({ message: 'You are authorized to access this resource', user: req.user});
});

app.listen(PORT);

    module.exports = verificationResponse;