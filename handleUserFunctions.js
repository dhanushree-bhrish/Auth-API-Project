const fs = require('fs');
const path = require('path');
let users = require('./users');

const usersFilePath = path.join(__dirname, 'users.json');

function saveUsers(users) {
    const usersJSON = JSON.stringify(users, null, 2);
    fs.writeFileSync(usersFilePath, usersJSON);
}

function getUsers() {
    const usersData = fs.readFileSync(usersFilePath);
    return JSON.parse(usersData);
}

function addUsers(username, email, password){
    //console.log(`name: ${typeof(username)}, email:${typeof(email)}, password: ${typeof(password)}`)
    if(typeof(username) === 'string' & typeof(email) === 'string' & typeof(password) === 'string'){
        data ={
            "username": username,
            "email": email,
            "password": password
        }
        const users = getUsers();
        users.push(data);
        saveUsers(users);
        return "success";
    }
}

function verifyCredentials(username, password){
    const users = getUsers();
    console.log(users);
    const userFound = users.find(user => user.username === username && user.password === password);
    console.log(`userFound: ${JSON.stringify(userFound)}`)
    if(!userFound){
        return null;
    }else{ 
        return userFound;
    }
}

module.exports = {getUsers, addUsers, saveUsers, verifyCredentials};
