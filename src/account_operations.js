import {auth, googleSignup} from './firebase';
import { sendLog } from './utils';
import axios from 'axios';
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';

class AccSequence extends Error {
    constructor(message) {
      super(message); 
      this.name = this.constructor.name;
    }
}

class FBError extends Error {
    constructor(message) {
      super(message); 
      this.name = this.constructor.name;
    }
}
  

async function newAccountSequence(data, errHandler, FB_errHandler){
    const {email, password, name, user} = data;
    try{
        let idtoken;
        if(user){ //user here means create account with google provider
            idtoken = await user.getIdToken();
        } else{ 
            // ------------- CREATE FIREBASE USER ------------- \\
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            if(!userCredential?.user) return errHandler('Unexpected error. Code 22.');
            idtoken = await userCredential.user.getIdToken();
        }

        if(!idtoken) return errHandler('Unexpected error. Code 27.');

        // ------------- CREATE STRIPE CUSTOMER ------------- \\
        const customer_res = await axios.post(`${window.appdata.API_ADDR}/create-stripe-customer`, {email, name});
        const stripe_customer_id = customer_res.data?.id;
        if(!stripe_customer_id) return errHandler('Unexpected error. Code 25.');

        // ------------- INSERT DB CLIENT ------------- \\
        const data = {email, name, idtoken, stripe_customer_id};
        const db_req = await axios.post(`${window.appdata.API_ADDR}/createAccount`, data );
        
        return {ok:true};
    } catch(err){
        if(err.code) return FB_errHandler(err.code) // if firebase error (with errcode)

        sendLog('Code 7 signup generic ' + String(err));
        return errHandler('Unexpected error. Code 26');
    }
}

export {newAccountSequence, FBError};

