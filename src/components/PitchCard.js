import React from 'react'
import './PitchCard.css';

const PitchCard = (props) => {
return (
    <div className='pitchcard'>
      <h3 className="pitchcard-title">{props.title}</h3>
      <p className="pitchcard-text">{props.children}</p>
      <div className="pitchcard-tag-container">
        {props.tags && props.tags.map(tag => <div className="pitchcard-tag">{tag}</div>)}
      </div>
    </div>
  )
}


export default PitchCard