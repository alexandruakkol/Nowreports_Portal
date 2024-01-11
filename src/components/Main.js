import React, {useState, useEffect, useContext, useRef} from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate
} from "react-router-dom";
import Navbar from './Navbar';
import Settings from '../pages/Settings';
import { AutoComplete, Input, Dropdown, Button, message, Avatar } from 'antd';
import axios from 'axios';
import { DownOutlined, SendOutlined } from '@ant-design/icons';
import { AuthContext, MainModeContext } from '../App';
import { generateID } from '../etc';
import Conversation from '../pages/Conversation';

const MainRouter = () => {

  const router = createBrowserRouter([
    {
      path: "/",
      element: WithNavbar(DefPage),
    },
    {
      path: "/settings",
      element: WithNavbar(Settings),
    },
    {
      path:"/conv/:convoID",
      element: WithoutNavbar(Conversation),
    }
  ]);
  
  return (
    <RouterProvider router={router} />
  )
}

function WithNavbar(El){
  return (
    <>
      <Navbar></Navbar>
      <div id="Main">
        <El></El>
      </div>
    </>
  )
}

function WithoutNavbar(El){
  return (
      <div id="Main" className="Main-noNavbar">
        <El></El>
      </div>
  )
}

function DefPage(){
  const {FB_USER} = useContext(AuthContext);
  const {MAIN_MODE, setMAIN_MODE} = useContext(MainModeContext);

  const [value, setValue] = useState('');
  const [options, setOptions] = useState([]);
  const [pageData, setPageData] = useState({});
  const [filing, setFiling] = useState('Latest annual report');
  const [configAnimation, setConfigAnimation] = useState('');
  const [aiAnimation, setAiAnimation] = useState('');
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState();
  const [iframeContent, setIframeContent] = useState();

  const navigate = useNavigate();

  async function loadReportFrame(seclink){
    const body = {"link":seclink};
    const res = await axios.post(`${window.appdata.API_ADDR}/reports`, body).catch(err=>console.log(err));
    setIframeContent(res?.data || '<h3>Cannot load report</h3>');
  };

  useEffect(() => {
    if(MAIN_MODE === 'config') setConfigAnimation('');
    if(MAIN_MODE === 'ai') setTimeout(() => setAiAnimation('fadeIn'),1000);
  }, [MAIN_MODE]);

  async function gotoAI(){
    setConfigAnimation('moveUp');
    setTimeout(() => {setMAIN_MODE('ai')}, 1000);
  }

  function onFilingSelect(e){
    console.log(e);
    setFiling(e);
  }

  async function createConversation(oo){
    console.log('creating conversation');
    const {ticker} = oo;
    const headers = {'Content-Type':'application/json'};
    const convoID = generateID(20);
    const payload = {uid:FB_USER.uid, convoID, ticker};
    const post_convo_res = await axios.post(`${window.appdata.API_ADDR}/conversations`, payload, {headers});
    const res_convoID = post_convo_res.data?.convoID;
    if(!res_convoID) return alert('Cannot create AI conversation. Please try again.'); //TODO: error mech
    navigate(`/conv/${res_convoID}`);
  }

  async function onSelectCompany(ticker){
    console.log('select company ', ticker);
    //const selectedObj = options.filter(x => x.ticker === ticker)[0];
    //const link = await axios.get(`${window.appdata.API_ADDR}/links?q=${ticker}`).catch(err=>console.log(err));
    //if(!link?.data) return console.log('Symbol error');
    createConversation({ticker});
    //loadReportFrame(link.data);
    //setPageData(selectedObj);
  };

  async function getSuggestions(query){
    const res = await axios.get(`${window.appdata.API_ADDR}/companies?q=${query}`).catch(err=>console.log(err));
    console.log(res.data);
    setOptions(res.data);
  }

  const items = [
    {
      label: (
        <a onClick={()=>onFilingSelect('Latest annual report')}>
          Latest annual report
        </a>
      ),
      key: '0',
    },
    {
      label: (
        <a onClick={()=>onFilingSelect('Latest quarterly report')}>
        Latest quarterly report
      </a>
      ),
      key: '1',
    },
  ];

  const filingOptions = {items};

  const renderOption = (obj) => (
    { 
      value:obj.symbol,
      label: 
      <div style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
        <span><b>{obj.symbol}</b></span>
        <span>{obj.value}</span>
      </div>, 
      key: obj.key
    }
  );
  
  function renderSymHeader(){
    return <>
      <div className="main-title">{pageData?.title || 'Now Reports AI'}</div>
      <div className="secondary-title">{pageData?.ticker || ''}</div>
    </>
  }
  function onMsgSend(){
    if(!msg) return;
    console.log(`sent msg ${msg}`);

    const newMessage = {text:msg, agent:'user', date:new Date()};
    setMessages([...messages, newMessage]);
    setMsg('');
  }

  function renderMsgAvatar(agent){
    if(agent === 'ai') return <Avatar
      style={{
        backgroundColor: 'purple',
        verticalAlign: 'middle',
      }}
      size="middle"
    >
    {FB_USER.fname[0]}
    </Avatar>;

    if(agent === 'user') return <Avatar
      style={{
        backgroundColor: 'purple',
        verticalAlign: 'middle',
      }}
      size="middle"
    >
      AI
    </Avatar>;
  }

  return (  
    <div id="main-flex">
      {(MAIN_MODE === 'ai') && <header id="sym-header">
        {renderSymHeader()}</header>}
      {(MAIN_MODE === 'config') && <div id="main-flex1" className={configAnimation || ''} >
        {renderSymHeader()}</div>}
      {MAIN_MODE == 'config' ? <>
        <div id="main-flex2" className={configAnimation === 'moveUp' && 'fadeOut'}></div>
        <div id="main-flex3" className={configAnimation === 'moveUp' && 'fadeOut'} >
          <AutoComplete  
            size="large"
            options={options.map(x=>renderOption(x))}
            style={{width: '100%'}}
            onSelect={onSelectCompany}
            onSearch={(text) => getSuggestions(text)}>
              <Input.Search size="large" placeholder="Search for a company" />
          </AutoComplete>
        </div>
        <div id="main-flex4" className={configAnimation === 'moveUp' && 'fadeOut'}>
            {pageData.ticker && 
              <div className="flex-row filing-ddown-container">
                <div>Filing: </div>
                  <div> 
                  <Dropdown menu={filingOptions} trigger={['click']}>
                    <div className="flex-row filing-ddown-container">
                      <a onClick={(e)=>e.preventDefault()}>{filing}</a>
                      <DownOutlined />
                    </div>
                  </Dropdown>
                  </div>
              </div>
            }
        </div>
        <div id="main-flex5" className={configAnimation === 'moveUp' && 'fadeOut'}>
            {/* {pageData.ticker && <Button onClick={gotoAI}>Start AI</Button>} */}
          <iframe
            hidden
            title="Dynamic_SEC"
            width="100%"
            srcDoc={iframeContent}
            height="400px"
          ></iframe>
        </div>
        
      </> : 
      // ------- AI MODE ------- \\
      <>
        <div id="ai-container" className={aiAnimation}>
          <div id="ai-scrollable-body">
            {messages.map(message =>
              <div className="message-container">
                {renderMsgAvatar(message.agent)}
                <b className="message-agent">{message.agent === 'user' ? 'You' : 'AI'}</b>
                <p className="message-text">{message.text}</p>
              </div>)
            }
          </div>
          <div id="ai-body">
            <SendOutlined onClick={onMsgSend} id="msg-send-icon"/>
            <Input.TextArea 
              value={msg}
              autoSize={{ minRows: 1, maxRows: 7 }}
              size="large" 
              enterButton="Search"
              placeholder="Ask Now Reports" 
              onPressEnter={onMsgSend}
              onChange={(e)=>setMsg(e.target.value)}
            />
          </div>
        </div>
      </>}
    </div>
  );
}


export default MainRouter