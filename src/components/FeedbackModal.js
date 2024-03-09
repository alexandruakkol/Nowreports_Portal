import React from "react";
import {Modal} from 'antd';
import {Button} from 'flowbite-react';
import { useState } from "react";
import { Input } from 'antd';
import axios from 'axios';
import { CiCircleCheck } from "react-icons/ci";
import { VscError } from "react-icons/vsc";

const FeedbackModal = (props) => {
  const { isOpen, setIsOpen, title } = props;
  const [text, setText] = useState("");
  const [modalState, setModalState] = useState('normal');

  let code;
  if(title === 'Write us a suggestion') code = 'app_suggestion';
  if(title === 'Report a problem') code = 'app_report_problem';

  if(!code) throw new Error('Feedback modal error: bad title');

  function sendFeedback(text){
    axios.post(`${window.appdata.API_ADDR}/feedback`, {text, typ:code})
      .then(res => { if(res.status === 200){ setModalState('success') } else setModalState('error') })
      .catch( _ => setModalState('error') );
    setText('');
  }

  const handleOk = () => {  
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Modal title={title} open={isOpen} onOk={handleOk} onCancel={handleCancel} 
        cancelButtonProps={'hidden'} 
        width={'40vw'}
        footer={[
          (modalState === 'normal' && <Button className='max-width' onClick={ () => sendFeedback(text)}>Send</Button>)
        ]}
      >

        {modalState === 'normal' && <div id="feedback-container">
          <Input.TextArea onChange={(a)=>setText(a.target.value)} autoSize={{ minRows: 6, maxRows: 20 }}></Input.TextArea>
        </div>}

        {modalState === 'success' && <div className="flex-center feedback-result-container"> 
          <h3>The message was submitted. Thank you!</h3>
          <CiCircleCheck className="feedback-icon feedback-success-icon"></CiCircleCheck>
        </div> }

        {modalState === 'error' && <div className="flex-center feedback-result-container"> 
          <h3>An error has occured. Contact us at <b>support@nowreports.com</b></h3>
          <VscError className="feedback-icon feedback-error-icon"></VscError>
        </div> }

      </Modal>
    </>
  );
};

export default FeedbackModal;
