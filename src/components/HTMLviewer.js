import React from 'react'
import { PlusOutlined, MinusOutlined, RedoOutlined } from '@ant-design/icons';

const HTMLviewer = (props) => {
    const {link, title} = props;
    let scale = Number(getComputedStyle(document.getElementById('root')).getPropertyValue('--scale-factor').trim());

    function setScale(scale){
       document.getElementById('iframe-report').style.transform = `scale(${scale})`;
    }

    function zoomIn(){
        scale += 0.1;
        setScale(scale);
        console.log(scale)
    }

    function zoomOut() {
        scale -= 0.1;
        setScale(scale);
    }
    
    function resetZoom(){
        scale = 0.8;
        setScale(scale);
    }

    return (
        
        <div id="htmlviewer-container">
            <div id="htmlview-header">
                <span>{title}</span>
                <span id="htmlviewer-control">
                    <MinusOutlined onClick={zoomOut}/>
                    <RedoOutlined onClick={resetZoom}/> 
                    <PlusOutlined onClick={zoomIn}/>
                </span>
                
            </div>
            <div id="iframe-container">
                <iframe id="iframe-report" src={link} title="report"></iframe>
            </div>
        </div>
    )
}

export default HTMLviewer