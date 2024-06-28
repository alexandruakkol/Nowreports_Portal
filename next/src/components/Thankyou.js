import React from 'react'
import { CiCircleCheck } from "react-icons/ci";

const Thankyou = (props) => {
  const {hidden} = props;
  const style = hidden ? {display:'none'} : {}
  return (
    <div style={style} className="thankyou-overlay flex-center">
        <div className="flex-center thankyou-container">
            <h3 className="text-medium">Thank you</h3>
            <CiCircleCheck className="feedback-icon feedback-success-icon"></CiCircleCheck>
        </div>
    </div>
  )
}

export default Thankyou