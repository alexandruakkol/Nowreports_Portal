import React, {useEffect, useState} from 'react'
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {Input} from 'antd';
import SplitPane, { Pane } from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';
import HTMLviewer from '../components/HTMLviewer';
import {SendOutlined} from '@ant-design/icons';

const Conversation = () => {

    const {convoID} = useParams();
    const [convo, setConvo] = useState([]);
    const [sizes, setSizes] = useState(['50%', '50%']);
    const [link, setLink] = useState();
    const [msg, setMsg] = useState('');
    const [symbol, setSymbol] = useState('');
    const [dragging, setDragging] = useState();
    const [reportData, setReportData] = useState();

    useEffect(() => {
        loadConversation().then(convoObj => {
            loadReport(convoObj[1][0].cik)
            setSymbol(convoObj[0].symbol);
        });
    }, []);
    
    async function loadConversation(){
        const convo_res = await axios.get(`${window.appdata.API_ADDR}/conversations/${convoID}`)
        .catch(err => console.log(err));
        const convo_obj = convo_res?.data;
        console.log(convo_obj)
        const [convo, reportData] = convo_obj;
        setConvo(convo);
        console.log({convo})
        setReportData(reportData[0]);
        return convo_obj;
    }

    async function loadReport(cik){
        if(!cik) return alert('No symbol');
        setLink(`${window.appdata.API_ADDR}/lastreport/${cik}`);
    }
    
    function displayMessage(msg, promise){
        const msg_obj = {msg};
        setConvo([...convo, msg_obj]);
    }

    function renderMessages(){
        console.log({convo})
        return (
        <div id="messages-container">
            {convo.map(message => {
                const rowtype = (message.agent === 'ai' ? 'ai-message-row' : 'user-message-row');
                return <div className={rowtype}>
                            <div className="message">{message.msg}</div>
                        </div>
            })}
        </div>);
    }

    async function onMsgSend(e){
        e.preventDefault();
        if(!msg?.length) return;
        const headers = {'Content-Type':'application/json'};
        const payload = {msg, convoID};
        const p_message = axios.post(`${window.appdata.API_ADDR}/messages`, payload, {headers}).catch(err => console.log(err));
        displayMessage(msg, p_message);
        setMsg('');
    }

    const startDrag = () => {
        setDragging(true);
    };

    const stopDrag = () => {
        setDragging(false);
    };

    function formatDate(datestring){
        if(!datestring) return;
        datestring = new Date(datestring);
        datestring = datestring.toISOString().split('T')[0]
        return datestring;
    }

    return (
        <div id="convo-container">
            <div id="convo-sidebar">
                <div className="allWidth">
                    <div id="logo"><img src="/nowreportslogo.png"></img></div>
                    <div className="convo-symboldata">
                        <div className="convo-symboldata-title">Symbol</div>
                        <div>{reportData?.symbol}</div>
                    </div>
                    <div className="convo-symboldata">
                        <div className="convo-symboldata-title">Report date</div>
                        <div>{formatDate(reportData?.repDate)}</div>
                    </div>
                    <div className="convo-symboldata">
                        <div className="convo-symboldata-title">Type</div>
                        <div>{reportData?.typ}</div>
                    </div>
                </div>
                <div id="active-convos"></div>
            </div>
            <SplitPane
                split='vertical'
                sizes={sizes}
                onChange={setSizes}
                id="convo-splitpane"
                onDragStart={startDrag}
                onDragEnd={stopDrag}
            >
                <Pane minSize={20} maxSize='80%'>
                    <section className="convo-pane" id="convo-pane-left">
                        {dragging && <div className="iframe-cover"></div>}
                        <HTMLviewer link={link} title={symbol}></HTMLviewer>
                    </section>
                </Pane>
                <Pane minSize={20} maxSize='80%' id="convo-pane-right">
                    <section className="convo-pane" id="chat-container">
                        <div id="chat-body">{renderMessages()}</div>
                        <div id="chat-bar">
                            <SendOutlined onClick={onMsgSend} id="msg-send-icon"/>
                            <Input.TextArea 
                                value={msg}
                                // autoSize={{ minRows: 1, maxRows: 7 }}
                                size="large" 
                                enterButton="Search"
                                placeholder="Ask Now Reports" 
                                onPressEnter={onMsgSend}
                                onChange={(e)=>setMsg(e.target.value)}
                                rows={1}
                            />
                        </div>
                       
                    </section>
                </Pane>
            </SplitPane>
        </div>
        
    )
}

export default Conversation