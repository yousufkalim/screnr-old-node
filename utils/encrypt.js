const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const ENCRYPTION_KEY = Buffer.from('NfSjGyWVrEE6seIupuneoaqdHvO5VyMC2clNhzeGFeA=', 'base64')
const IV_LENGTH = 16;

function encrypt(text) {
  try{
        let iv = crypto.randomBytes(IV_LENGTH);
        let cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch(e){
        console.trace(e);
    }
}

function decrypt(text) {
    try{
        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch(e){
        console.trace(e);
    }
}

function encryptQuestionObj(obj){
    const encryptedObj = {
        ...obj
    };
    const encryptedAnswers = [];

    if(obj.title){
        encryptedObj.title = encrypt(obj.title);
    }

    if(obj.description){
        encryptedObj.description = encrypt(obj.description);
    }

    obj.answers.forEach(e => {
        encryptedAnswers.push(encrypt(e));
    });

    encryptedObj.answers = encryptedAnswers;

    return encryptedObj;
}

function decryptQuestionObj(obj){
    const decryptedObj = {
        ...obj
    };
    const decryptedAnswers = [];
    const decryptedValues = [];

    if(obj.title){
        decryptedObj.title = decrypt(obj.title);
    }

    if(obj.description){
        decryptedObj.description = decrypt(obj.description);
    }

    obj.answers.forEach(e => {
        decryptedAnswers.push(decrypt(e));
    });

    obj.value.forEach(e => {
        decryptedValues.push(decrypt(e));
    });

    if(obj.feedback){
        decryptedObj.feedback = decrypt(obj.feedback);
    }

    decryptedObj.answers = decryptedAnswers;
    decryptedObj.value = decryptedValues;

    return decryptedObj;
}

function encryptArr(arr){
    const encryptedArr = [];

    for(let i = 0; i < arr.length; i++){
        const str = arr[i];
        const encryptedStr = encrypt(str);
        encryptedArr.push(encryptedStr);
    }

    return encryptedArr;
}

module.exports = {
    encryptQuestionObj,
    encryptArr,
    encrypt,
    decryptQuestionObj,
    decrypt
}