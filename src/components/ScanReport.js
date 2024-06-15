import React from 'react'
import './ScanReport.css'
import { Divider } from 'antd';

const STOPWORDS = ['insignificant', "I'm sorry", "I am unable"];

const ScanReport = (props) => {
    const {symboldata, aidata} = props;
    console.log({symboldata})

    function hasStopwords(text) {
        for (let word of STOPWORDS) if (text.includes(word)) return true;
        return false;
    }

    return (
    <div id="scanreport-container">

        <div className="scanreport-header heading-subtitle text-center heading-third text-medium">
            <div className="header-spacing"></div>
            <div className="async-headerline scanreport-scantype"><p>Type: <span className='scanreport-scantype-tag'>Critical Business Scan</span></p></div>
            <div className="headerline"><span><h3>{symboldata.name}</h3><h6>{symboldata.symbol}</h6></span></div>
            <div className="header-spacing"></div>
            <div className="headerline"><h4>Nowreports AI Scan Report</h4></div> 
            <div className="headerline scanreport-smalltext"><h6>Based on value investing principles</h6></div>
            <div className="header-spacing"></div>
        </div>

        <div>{aidata.map((question, ix) => {
            if((question.reply.length < 5) || hasStopwords(question.reply)) return <></>
            return (
            <div key={ix}>
                <div className="scanpart-title">{question.display}</div>
                <div>{question.reply?.replaceAll('\n\n', '\n').split('\n')?.map((paragraph, ix) => <div key={ix}>{ix>1 && <br></br>}<p>{paragraph}</p></div>) || '...'}</div>
                <Divider></Divider>
            </div>)}
        )}</div>

    </div>
  )
}

export default ScanReport