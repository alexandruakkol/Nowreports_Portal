import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
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
    const [isWaiting, setIsWaiting] = useState(false);

    const navigate = useNavigate();
    const endOfChatRef = useRef(null);

    useEffect(() => {
        loadConversation().then(convoObj => {
            const convoData = convoObj[1][0];
            loadReport(convoData.cik)
            setSymbol(convoData.symbol);
        });
    }, []);
    
    useEffect(() =>{ 
        // scroll chat div to end
        if (endOfChatRef.current) {
            endOfChatRef.current.scrollTop = endOfChatRef.current.scrollHeight;
        }

        if(convo?.length){
            let filingID = reportData?.filingid;
            if(!filingID) return alert('No filingID', reportData);
    
            let promise;
            const thisMessage = convo[convo.length-1];
            let {msg, agent, sent} = thisMessage;
            if(sent) return;

            // new message section
            console.log('seding this message', thisMessage);
            console.log('sending new message');
            const headers = {'Content-Type':'application/json'};
            const db_payload = {msg, convoID, agent};
            setIsWaiting(true);

            msg = msg.replace('[AI]:','');
            const db_promise = axios.post(`${window.appdata.API_ADDR}/messages`, db_payload, {headers}).catch(err => console.log(err));
            
 
            if(agent == 'cl'){ // send to AI API
                // add last 5 msgs of convo
                function decode_agent(code){
                    return {cl: '[CLIENT]', ai: '[AI]'}[code];
                }
                let last_5_msgs = convo.slice(-5).map(el => decode_agent(el.agent) + ': ' + el.msg).join(' , ');
                last_5_msgs = '[Previous messages]: ' + last_5_msgs;
                const full_message = last_5_msgs + ' [-Current question-]: [CLIENT]:' + msg;
                const ai_payload = {message:full_message, filingID};
                promise = axios.post(`${window.appdata.AI_API_ADDR}/completion`, ai_payload, {'Content-Type':'application/json'}).catch(err => console.log(err));
                
                promise.then(resp => {
                    if(resp?.data) sendMessage(resp.data, 'ai');
                    else console.log('wrong resp', resp); //TODO: centralize error
                });
            } 
            if(agent == 'ai'){ // send to DB
                db_promise.then(()=>{
                    convo.pop();
                    setIsWaiting(false);
                    setConvo([...convo, {...thisMessage, sent:true}]);
                })
            }
        }
    },[convo])

    async function loadConversation(){
        const convo_res = await axios.get(`${window.appdata.API_ADDR}/conversations/${convoID}`)
        .catch(err => console.log(err));
        const convo_obj = convo_res?.data;
        let [convo, reportData] = convo_obj;
        console.log('starting page with convo:', convo)
        convo.forEach(x => x.sent=true) //mark as sent
        setConvo(convo);
        setReportData(reportData[0]);
        return convo_obj;
    }

    async function loadReport(cik){
        if(!cik) return alert('No symbol');
        setLink(`${window.appdata.API_ADDR}/lastreport/${cik}`);
    }
    
    function renderMessages(){
        if(!convo.length) return <>No messages</>
        return (
            <>
                {convo?.map(message => {
                    const rowtype = (message.agent === 'ai' ? 'ai-message-row' : 'user-message-row');
                    const divtype = (message.agent === 'ai' ? 'ai-message-msg' : 'user-message-msg');
                    return <div className={rowtype}>
                                <div className={`message ${divtype}`}>{message.msg}</div>
                            </div>
                })}
            </>);
    }    

    function sendMessage(msg, agent){
        if(!['cl', 'ai'].includes(agent)) return alert('invalid agent'); //TODO: centralize
        const msg_obj = {msg, agent};
        setConvo([...convo, msg_obj]); // add to convo stack
    }

    async function onMsgSend(e){
        e.preventDefault();
        if(!msg?.length) return;
        sendMessage(msg, 'cl'); 
        setMsg('');
    }

    const startDrag = () => {setDragging(true)};
    const stopDrag = () => {setDragging(false)};

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
                    <div id="logo" onClick={() => navigate('/')}><img src="/nowreportslogo.png"></img></div>
                    <div className="convo-symboldata">
                        <div className="convo-symboldata-title">Symbol</div>
                        <div>{reportData?.symbol || 'N/A'}</div>
                    </div>
                    <div className="convo-symboldata">
                        <div className="convo-symboldata-title">Report date</div>
                        <div>{formatDate(reportData?.repdate) || 'N/A'}</div>
                    </div>
                    <div className="convo-symboldata">
                        <div className="convo-symboldata-title">Type</div>
                        <div>{reportData?.typ || 'N/A'}</div>
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
                        
                        <div id="chat-body" ref={endOfChatRef} >{
                            <>
                                {renderMessages()}
                                {isWaiting && <div id="messages-container">
                                    <div className='ai-message-row'>
                                        <div className={`message ai-message-msg loading-msg`}>...</div>
                                    </div>
                                </div>}
                            </>}</div>
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