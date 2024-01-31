import React from 'react';
import {useParams} from 'react-router-dom'; 
import Conversation from '../pages/Conversation';

const ConversationRouter = () => {

    const {convoID} = useParams();
    
  return (
    <>  
        <Conversation convoID={convoID}></Conversation>
    </>
  )
}

export default ConversationRouter