import crypto from 'crypto-js';

const encrypted = JSON.stringify(crypto.SHA256('password').words);
const password = 'password';

console.log(JSON.stringify(crypto.SHA256(password).words) === encrypted);
