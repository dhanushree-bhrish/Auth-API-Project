const fs = require('fs');
const path = require('path');
const verificationResponse = require('./auth');
let tokens = require('./tokens.json');

//Generating a Random Token
function generateToken(length) {
    let token = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters.charAt(randomIndex);
    }

    return token;
}

//Authorization
const authorizeUser = (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token);
    const tokenUserFound = tokens.find(eachToken=> eachToken.token === token);
    console.log(tokenUserFound);
    if (!token || !tokenUserFound) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }
    req.user = tokenUserFound.verificationResponse;
    next();
};

//Handle token functions
const tokensFilePath = path.join(__dirname, 'tokens.json');

function saveTokens(tokens) {
    const tokenJSON = JSON.stringify(tokens, null, 2);
    fs.writeFileSync(tokensFilePath, tokenJSON);
}

function getTokens() {
    const tokensData = fs.readFileSync(tokensFilePath);
    return JSON.parse(tokensData); // Parse JSON data into an object
}

function addTokens(token, verificationResponse) {
    if (typeof token === 'string' && typeof verificationResponse === 'object') {
        const tokenList = getTokens();
        const newTokenEntry = { token: token, verificationResponse: verificationResponse };
        tokenList.push(newTokenEntry); // Assuming token is a property of userList
        saveTokens(tokenList); // Save the updated token list
        return "success";
    }
}


module.exports = {authorizeUser, generateToken, getTokens, addTokens, saveTokens};