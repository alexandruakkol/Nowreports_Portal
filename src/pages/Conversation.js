import React, {useEffect, useState, useRef, useContext} from 'react'
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import {Input} from 'antd';
import SplitPane, { Pane } from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';
import HTMLviewer from '../components/HTMLviewer';
import {SendOutlined} from '@ant-design/icons';
import {AuthContext} from '../App';
import { sendLog } from '../utils';

const Conversation = (props) => {

    const {convoID} = props;
    const [convo, setConvo] = useState([]);
    const [sizes, setSizes] = useState(['25%', '75%']);
    const [link, setLink] = useState();
    const [msg, setMsg] = useState('');
    const [symbol, setSymbol] = useState('');
    const [dragging, setDragging] = useState();
    const [reportData, setReportData] = useState();
    const [isReportShown, setIsReportShown] = useState(false);
    const [isReportLoading, setIsReportLoading] = useState(false);

    const navigate = useNavigate();
    const endOfChatRef = useRef(null);
    const {CREDITS, setCREDITS} = useContext(AuthContext);

    useEffect(() => {
        loadConversation().then(convoObj => {
            const convoData = convoObj[1][0];
            loadReport(convoData.cik)
            setSymbol(convoData.symbol);
        });
    }, []);
    
    useEffect( () => { 
        // scroll chat div to end
        if (endOfChatRef.current) {
            endOfChatRef.current.scrollTop = endOfChatRef.current.scrollHeight;
        }

        if(convo?.length){
            let filingID = reportData?.filingid;
            if(!filingID) return alert('No filingID', reportData);
    
            const thisMessage = convo[convo.length-1];
            let {msg, agent, sent, incoming, first, db_notsend} = thisMessage;
            if(sent) return;

            // new message section
            const headers = {'Content-Type':'application/json'};
            const db_payload = {msg, convoID, agent};

            if(incoming){
                function decodeAgent(agent){return {'cl':'user', 'ai':'assistant'}[agent]}
                let last_5_msgs = convo.slice(-5).map(el => {return {role:decodeAgent(el.agent), content:el.msg}});
                let messages = last_5_msgs;
                const ai_payload = {messages:JSON.stringify(messages.filter(x => x.content)), filingID};

                if(first) fetch(`${window.appdata.API_ADDR}/completionproxy`, {   
                    method:'POST', 
                    body:JSON.stringify(ai_payload), 
                    headers:{'Content-Type':'application/json', responseType:'stream'},
                    credentials: 'include',
                }).then(response => {    
                    const reader = response.body.getReader();
                    
                    const decoder = new TextDecoder();
                    let result = '';
                    
                    // -------------- SUBTRACT INTERFACE CREDIT -------------- \\
                    if(response.status ===  200) setCREDITS(CREDITS-1);

                    // -------------- PROCESS INCOMING STREAM -------------- \\

                    reader.read().then(function processText({ done, value }) {
                        result += decoder.decode(value, { stream: true });
                        const messages = result.split('\n');

                        if (done) {
                            const lastMessage = convo.pop();
                            // Handle not enough credits msg

                            if(result == 'Not enough credits' && response.status == 403){
                                return setConvo([...convo, {agent:'ai', msg:result , incoming:false, db_notsend:true}]);
                            }

                            db_payload.msg = lastMessage.msg;
                            setConvo([...convo, {...lastMessage, incoming:false, db_notsend:true}]);
                            const db_promise = sendMessageToDB(db_payload, headers);
                            return;
                        }
                        
                        // Last entry might be incomplete if not ended with a newline
                        result = messages.pop();

                        messages.forEach(message => {
                            try {
                                let incomingMsg;
                                let newConvo = [];
                                for(let msg of convo){
                                    if(msg.incoming) incomingMsg=msg;
                                    else newConvo.push(msg);
                                }   
                                if(!incomingMsg) throw new Error('No incoming msg found (sync issue?)'); 
                                incomingMsg.msg = (incomingMsg.msg ?? '') + message; 
                                incomingMsg.first=false;
                                setConvo([...newConvo, incomingMsg]);
                            } catch (err) {
                                console.error('Error parsing message:', message, err);
                            }
                        });
        
                        // Read the next chunk
                        reader.read().then(processText);
                    });

                })
                return;
            }

            if (db_notsend) return;
            msg = msg.replace('[AI]:', '');
            const db_promise = sendMessageToDB(db_payload, headers);
            
            if(agent == 'cl'){ // send to AI API
                const incoming_convo_msg = {agent:'ai', incoming:true, first:true};
                setConvo([...convo, incoming_convo_msg]);
            }
              
            if(agent == 'ai'){ // send to DB
                db_promise.then(() => {
                    convo.pop();
                    setConvo([...convo, {...thisMessage, sent:true}]);
                })
            }
        }
    },[convo]);

    useEffect(() => {
        if(isReportShown === true) setIsReportLoading(true);
        setTimeout(() => {setIsReportLoading(false)}, 5000);
    }, [isReportShown]);

    async function sendMessageToDB(db_payload, headers){
        return await axios.post(`${window.appdata.API_ADDR}/messages`, db_payload, {headers, withCredentials:true})
            .catch(err => sendLog('Code 3 messages ' + String(err)));
    }

    async function loadConversation(){
        const convo_res = await axios.get(`${window.appdata.API_ADDR}/conversations/${convoID}`)
            .catch(err => sendLog('Code 4 conversations ' + String(err)));
        const convo_obj = convo_res?.data;
        let [convo, reportData] = convo_obj;
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
        if(!convo.length) return <></>
        return (
            <>
                {convo?.map(message => {
                    const rowtype = (message.agent === 'ai' ? 'ai-message-row' : 'user-message-row');
                    const divtype = (message.agent === 'ai' ? 'ai-message-msg' : 'user-message-msg');
                    const loadingClass = message.first ? 'loading-msg' : ''
                    return <div className={rowtype}>
                                <div className={`message ${divtype} ${loadingClass}`}>{message.msg || '...'}</div>
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
        datestring = datestring.toISOString().split('T')[0];
        return datestring;
    }
    return (
        <div id="convo-container">
            <div id="convo-sidebar">
                <div id="sidebar-upper" className="sidebar-section">
                    <div id="logo" onClick={() => navigate('/portal')}><img src="/nr_full_logo.svg"></img></div>
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
                    <div className="convo-subscription" onClick={()=>navigate('/subscription')}>
                        <div className="convo-symboldata-title">Remaining credits</div>
                        <div>{CREDITS || '0'}</div>
                    </div>
                </div>
                <div id="sidebar-section-lower" className="sidebar-section">
                    <div className="convo-subscription" onClick={()=>navigate('/subscription')}>
                        <div className="convo-symboldata-title">Get credits</div>
                        <div>Become a member</div>
                    </div>
                </div>
                <div id="active-convos"></div>
            </div>
            <div id="convo-splitpane">
                <div id="loading-panel-container" hidden={!isReportLoading}>
                    <div class="sk-folding-cube">
                        <div class="sk-cube1 sk-cube"></div>
                        <div class="sk-cube2 sk-cube"></div>
                        <div class="sk-cube4 sk-cube"></div>
                        <div class="sk-cube3 sk-cube"></div>
                    </div>
                </div>
                <SplitPane
                    split='vertical'
                    sizes={sizes}
                    onChange={setSizes}
                    
                    onDragStart={startDrag}
                    onDragEnd={stopDrag}
                >
                    <Pane minSize={20} maxSize='80%'>
                        
                        <section className="convo-pane" id="convo-pane-left">
                            {dragging && <div className="iframe-cover"></div>}
                            {isReportShown ? <HTMLviewer link={link} title={symbol}></HTMLviewer> 
                            : <div id="convo-pane-left-beforeloading">
                                <button onClick={()=>{setIsReportShown(true)}} type="button" class="h-12 py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                    Read report</button>
                            </div>}
                        </section> 
        
                    </Pane>

                    <Pane minSize={20} maxSize='80%' id="convo-pane-right">
                        <section className="convo-pane" id="chat-container">
                            
                            <div id="chat-body" ref={endOfChatRef} >{
                                <>

                                    {renderMessages()}
                                    {/* {isWaiting && <div id="messages-container">
                                        <div className='ai-message-row'>
                                            <div className={`message ai-message-msg loading-msg`}>...</div>
                                        </div>
                                    </div>} */}

                                </>}</div>
                            <div id="chat-bar">
                                <SendOutlined onClick={onMsgSend} id="msg-send-icon"/>
                                <Input.TextArea 
                                    value={msg}
                                    size="large" 
                                    enterButton="Search"
                                    placeholder="Does the company have enough liquid assets to cover their debts?" 
                                    onPressEnter={onMsgSend}
                                    onChange={(e) => setMsg(e.target.value)}
                                    rows={1}
                                />
                            </div>
                        
                        </section>
                    </Pane>
                </SplitPane>
            </div>
        </div>
        
    )
}

export default Conversation;