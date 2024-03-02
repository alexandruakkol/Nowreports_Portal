import axios from 'axios';

async function sendLog(message){
    try{
        axios.post(`${window.appdata.API_ADDR}/logs`, {txt:message});
    }catch(err){console.log('logging error')}
}

function FB_err_handler(errCode){
    switch(errCode){
        case 'auth/weak-password' : 
            return 'Password too weak. Strenghten your password.';
        case 'auth/email-already-in-use' : 
            return 'Cannot create account with this email.';
        default:
            return 'Account creation error. Please try again later. Code 24.';
    }
}


export {sendLog, FB_err_handler}