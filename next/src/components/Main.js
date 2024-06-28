import React, {useState, useContext} from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate
} from "react-router-dom";
import Old_navbar from './Old_navbar';
import Settings from '../pages/Settings';
import { AutoComplete, Input } from 'antd';
import axios from 'axios';
import { AuthContext } from '../App';
import { generateID } from '../etc';
import ConversationRouter from './ConversationRouter';
import Subscription from './Subscription';
import Landing from '../pages/Landing';
import { sendLog } from '../utils';


const MainRouter = () => {

  const router = createBrowserRouter([
    {
      path: "/",
      element: WithoutNavbar(Landing),
    },
    {
      path: "/login",
      element: WithNavbar(DefPage),
    },
    {
      path: "/portal",
      element: WithNavbar(DefPage),
    },
    {
      path: "/settings",
      element: WithNavbar(Settings),
    },
    {
      path: "/subscription",
      element: WithNavbar(Subscription),
    },
    {
      path:"/conv/:convoID",
      element: WithoutNavbar(ConversationRouter),
    },
    {
      path:"*",
      element: WithNavbar(DefPage),
    }
  ]);
  
  return (
    <RouterProvider router={router} />
  )
}

function WithNavbar(El){
  return (
    <>
      <Old_navbar></Old_navbar>
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

  const [options, setOptions] = useState([]);
  const [filing, setFiling] = useState('Latest annual report');

  const navigate = useNavigate();

  function onFilingSelect(e){
    setFiling(e);
  }

  async function createConversation(oo){
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
    const obj = options.filter(x=>x.symbol === ticker)[0];
    if(!obj.chunks) return;
    createConversation({ticker});
  };

  async function getSuggestions(query){
    const res = await axios.get(`${window.appdata.API_ADDR}/companies?q=${query}`)
      .catch(err=>sendLog('Code 2 suggestions ' + String(err)));
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

  const renderOption = (obj) => {
    const {symbol, chunks, name} = obj;
    const color = chunks ? '' : 'noreport_option';

    return { 
      value: symbol,
      label: 
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
        className={color}
      >
        <span><b>{symbol}</b></span>
        <span>{name}</span>
        {/* <span>{obj.chunks ? '': 'Not available'}</span> */}
      </div>, 
      key: obj.key
    }
  }

  return (  
    <div id="main-flex">
      <div className='main-section' id="main-section-1"></div>
      <div className='main-section' id="main-section-2">
      <h2 className="logo-text text-large">CEO Chat</h2>
        <AutoComplete  
          options={options.map(x=>renderOption(x))}
          style={{width: '42vw'}}
          onSelect={onSelectCompany}
          onSearch={(text) => getSuggestions(text)}
          className="rethink"
        >
            <Input.Search className="rethink" size="large" placeholder="Search for a company"/>
        </AutoComplete>
      </div>
      <div className='main-section' id="main-section-3"></div>

    </div>
  );
}


export default MainRouter