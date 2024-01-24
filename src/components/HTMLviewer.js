import React from 'react'
import { PlusOutlined, MinusOutlined, RedoOutlined } from '@ant-design/icons';

const HTMLviewer = (props) => {
    const {link, title} = props;
    const scale = {
        value: null,
        init : () => scale.value = Number(getComputedStyle(document.getElementById('root')).getPropertyValue('--scale-factor').trim()),
        set: (newScale) => {
            console.log({newScale})
            scale.value = newScale;
            document.getElementById('iframe-report').style.transform = `scale(${scale.value})`;
        },
        increment: () => scale.set(scale.value + 0.1),
        decrement: () => scale.set(scale.value - 0.1),
        reset: () => scale.set(1)
    };

    scale.init();

    return (
        
        <div id="htmlviewer-container">
            <div id="htmlview-header">
                <span>{title}</span>
                <span id="htmlviewer-control">
                    <MinusOutlined onClick={scale.decrement}/>
                    <RedoOutlined onClick={scale.reset}/> 
                    <PlusOutlined onClick={scale.increment}/>
                </span>
                
            </div>
            <div id="iframe-container">
                <iframe sandbox="allow-same-origin" id="iframe-report" src={link} title="report"></iframe>
            </div>
        </div>
    )
}

export default HTMLviewer