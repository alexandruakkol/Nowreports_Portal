import axios from 'axios';

async function sendLog(message){
    try{
        axios.post('/logs', {txt:message});
    }catch(err){console.log('logging error')}
}



export {sendLog}