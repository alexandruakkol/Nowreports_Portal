import {useEffect, useState, memo, useRef} from 'react'
import { PlusOutlined, MinusOutlined, RedoOutlined } from '@ant-design/icons';
import axios from 'axios';

const HTMLviewer = (props) => {
    const {link, title} = props;
    const [iframelink, setiframelink] = useState('');
    const [iframedata, setiframedata] = useState('');

    useEffect(() => {
        if(link) fetch(link).then(response => {
            const reader = response.body.getReader();
            return new ReadableStream({
            start(controller) {
                function push() {
                reader.read().then(({ done, value }) => {
                    if (done) {
                    controller.close();
                    return;
                    }
                    controller.enqueue(value);
                    push();
                });
                }
                push();
            }
            });
        })
        .then(stream => {
            return new Response(stream).text();
        })
        .then(text => {
            setiframedata(text);
        })
        .catch(err => console.error('Stream fetch error:', err));
    }, [link]);

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

    if(link) return (
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
                <iframe loading="lazy" id="iframe-report" title="report" sandbox="allow-same-origin" srcDoc={iframedata}></iframe>
            </div>
        </div>
    ); else return <></>
}

export default memo(HTMLviewer);