import { useState, useRef, useEffect } from 'react'
import Footer from '../components/Footer';
import { HiOutlineChevronDoubleDown } from "react-icons/hi";
import { Card, Button } from 'flowbite-react';
import axios from 'axios';
import Thankyou from '../components/Thankyou';
import { Input } from 'antd';
import {Navbar} from 'readyui';
//import {Navbar} from '../components/Navbar';

const Landing = () => {

    const ALLOWED_MODES = ['pitch', 'about', 'new-features'];
    const MAX_FEATURE_SELECT = 2;

    const [mode, setMode] = useState('pitch'); 
    const [featuresData, setFeaturesData] = useState([]);
    const aboutRef = useRef();
    const pitchRef = useRef();
    const featuresRef = useRef();
    const [selectedNavbar, setSelectedNavbar] = useState('pitch');
    const [isSentFeatures, setIsSentFeatures] = useState(false);
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [customSuggestion, setCustomSuggestion] = useState('');
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);
    const [logo, setLogo] = useState('nr_w_text_black.png');

    let pageSize = 'desktop';

    useEffect(() => {
        if((mode === 'new-features') && (!featuresData.length) ){ // only calls on newfeatures mode
            axios.get('/features')
            .then(res => setFeaturesData(res.data))
        }

        const REFS = {'pitch':pitchRef, 'about':aboutRef, 'new-features':featuresRef};

        REFS[mode].current.focus();

    }, [mode]);


    useEffect(() => {
        document.addEventListener('keydown', handleTabKey);

        return () => {
          document.removeEventListener('keydown', handleTabKey);
        };
    },[]);

    const handleTabKey = (e) => {  // Tab breaks page when unhandled (goes to out of view pseudo-pages) TODO: handle 
        const target = e.target;
        if (e.key === 'Tab') {
          e.preventDefault();
        }
    };

    const onNavbarSectionChange = (e) => {
        const goto = e.target.getAttribute('goto');
        setSelectedNavbar(goto);
        if(ALLOWED_MODES.includes(goto)) return setMode(goto);
        else window.location.href = window.location.origin+'/'+goto;
    };

    function onLogoClick(){
        setMode('pitch');
    }

    function selectFeature(e){
        const classlist = e.currentTarget.classList;
        if(classlist.contains('selected')) {
            classlist.remove('selected');
            const filitedFeatures = selectedFeatures.filter(x=>x!==e.currentTarget.id);
            setSelectedFeatures(filitedFeatures);
        }
        else {
            if(selectedFeatures.length === MAX_FEATURE_SELECT) return
            classlist.add('selected');
            setSelectedFeatures([...selectedFeatures, e.currentTarget.id]);
        };
    }

    function sendFeatures(){
        let featuresArray = selectedFeatures;
        if(customSuggestion) featuresArray.push({customSuggestion});

        for(const feature of selectedFeatures.slice(0 ,MAX_FEATURE_SELECT + 1)){
            let obj;
            if(feature.customSuggestion) obj = {text: feature.customSuggestion, typ:'custom_suggestion'}
            else obj = {text: feature, typ:'feature_code'};
            axios.post(`${window.appdata.API_ADDR}/feedback`, obj);   
        }
        setIsSentFeatures(true);
    }


    const items = [
        <span className={`nav-button highlight-anim red-anim ${(selectedNavbar === 'about') && 'selected-button'}`} goto='about' ref={aboutRef} onClick={onNavbarSectionChange}>About Us</span>,
        <span className={`nav-button highlight-anim red-anim ${(selectedNavbar === 'pitch') && 'selected-button'}`} goto='pitch' ref={pitchRef} onClick={onNavbarSectionChange}>How we save you time</span>,
        <span className={`nav-button highlight-anim red-anim ${(selectedNavbar === 'new-features') && 'selected-button'}`} goto='new-features' ref={featuresRef} onClick={onNavbarSectionChange}>New features</span>,
    ]

    const cta = <button id="goto-portal" className="highlight-anim red-anim nowrep-button" type="disabled" 
                        onClick={() => {window.location.pathname='/signup'}}>
                        Try NowReports AI
                </button>
              

    const small_logo = <img 
        style={{width: '4rem'}} 
        alt="Now Reports Logo" src='./nr_logo.png'></img>; //TODO: onClick={onLogoClick}

    const large_logo = <img 
        style={{width: '12rem'}}
    alt="Now Reports Logo" src='./nr_w_text_black.png'></img>; //TODO: onClick={onLogoClick}

  return (
    <>
        <Navbar id="landing-navbar" large_logo={large_logo} small_logo={small_logo} items={items} cta_button={cta}></Navbar>

        {/* <div id="navbar-mid-options">
            <span className={`nav-button highlight-anim red-anim ${(selectedNavbar === 'about') && 'selected-button'}`} goto='about' ref={aboutRef} onClick={onNavbarSectionChange}>About Us</span>
            <span className={`nav-button highlight-anim red-anim ${(selectedNavbar === 'pitch') && 'selected-button'}`} goto='pitch' ref={pitchRef} onClick={onNavbarSectionChange}>How we save you time</span>
            <span className={`nav-button highlight-anim red-anim ${(selectedNavbar === 'new-features') && 'selected-button'}`} goto='new-features' ref={featuresRef} onClick={onNavbarSectionChange}>New features</span>
        </div>
        
        <a id="goto-portal" className="highlight-anim red-anim nowrep-button" type="disabled" href="/signup">
            {mode == 'main' ? 'Go to Portal' : 'Try NowReports AI'}
        </a> */}

        {/* ----------------- MAIN MODE ----------------- */}

        {/* ----------------- PITCH MODE ----------------- */}

        <section id="pitch" mode="pitch" className={`landing-section ${mode == 'pitch' ? 'active' : ''}` } role="region" aria-label="Main section">
            <div className="heading-element">
                <div className="heading-container">
                    <div className="heading heading-title text-center">
                        The <span className="blue-text-accent"> one-stop-shop</span> for stock research</div>
                        <p className="text-medium text-center heading-secondary">Searching through 10-K reports just got better.</p>
                    {/* <div className="heading heading-subtitle text-center">with state of the art AI.</div> */}
                    <div className="heading-subtitle text-center heading-third text-medium">
                        <p className="text-SM">
                            Get instant answers to your business-related questions, as if you were talking to the board themselves.
                        </p>
                        <p className="text-SM">
                            Powered by state of the art AI.
                        </p>
                    </div>
             
                </div>

                <div id="main-goto-portal">
                    <a id="goto-portal" className="highlight-anim red-anim nowrep-button" type="disabled" href="/signup">
                        Try NowReports AI
                    </a>
                </div>

                <div id="main-chevron">
                    <HiOutlineChevronDoubleDown style={{fontSize:70}}/>
                </div>
            </div>
            <div className="pitch-flex1 pitch-flex">


                <div className="pitch-element">
                    <div className="pitch-element-body">

                        <div className="pitch-title">Quickly find business weakpoints.</div>
                        <div className="typing typing-anim1 typing_freq4 message">Is the company over-exposed to one vendor, customer, or anything else?</div>
                        <div className="delayed-text typing_response message ai-message-msg">The company's risk disclosure indicates potential over-exposure to key customers. Approximately 51.8% of the company's revenue comes from only two customers.</div>
                    </div>
                </div>

                <div className="pitch-element">
                    <div className="pitch-element-body">
                        <div className="pitch-title">No more sugarcoating. </div>
                        <div className="typing typing-anim1 typing_freq4 message">Is any business segment slowing down?</div>
                        <div className="delayed-text typing_response message ai-message-msg">In 2023, the company's laptop division saw a 36% reduction in net sales compared to 2022, primarily attributed to diminished sales in China, resulting from a decline in market share in the Asia region.</div>
                    </div>
                </div>

                <div className="pitch-element">
                    <div className="pitch-element-body">
                        <div className="pitch-title">Find a needle in a haystack.</div>
                        <div className="typing typing-anim1 typing_freq4 message">Does the company address the excess amount of cash?</div>
                        <div className="delayed-text typing_response message ai-message-msg">The report indicates that the company plans to allocate $8,843 million of its cash towards the creation of new self-storage units. Therefore, it seems that the company is addressing the excess amount of cash and has plans for utilizing it effectively.</div>
                    </div>
                    <div className="pitch-text"></div>
                </div>

                <div className="pitch-element">
                    <div className="pitch-element-body">

                        <div className="pitch-title">Get the big picture.</div>
                        <div className="typing typing-anim1 typing_freq4 message">What does the company need the large amount of debt for?</div>
                        <div className="delayed-text typing_response message ai-message-msg">The company has incurred significant net losses in each year since its inception. This history of losses indicates that the company is not generating enough revenue to cover its expenses and fund its operations. Additionally, the company is dependent on future performance for servicing its debt, which is subject to economic, financial, competitive, and other uncontrollable factors.</div>
                    </div>
                </div>

                <div className="pitch-element">
                    <div className="pitch-element-body">
                        <div className="pitch-title">Gain complex insights, effortlessly.</div>
                        <div className="typing typing-anim1 typing_freq4 message">What does the company invest the most in? How much is it, as % of net income?</div>
                        <div className="delayed-text typing_response message ai-message-msg">The company invests the most in equity investments (securities and privately held companies), totaling $1,834 million. This represents approximately 88% of the net income.</div>
                    </div>
                </div>


                <div id="pitch-goto-portal" className="highlight-anim red-anim nowrep-button" goto="signup" onClick={onNavbarSectionChange}>
                    Try NowReports AI
                </div>
                {/* <Footer></Footer> */}
            </div>
            <div>
                <Footer fn_goto_about={()=>setMode('about')}></Footer>
                <div id="ending-pitch-filler"></div>
            </div>
        </section>

        {/* ----------------- PITCH MODE ----------------- */}
        <section id="about" mode="about" className={`landing-section ${mode == 'about' ? 'active' : ''}`} role="region" aria-label="About us section">
            <div id="about-container">
                <div className="about-section about-section1">
                   
                    <b>Our Vision</b>

                    <p>We provide advanced tools for business research.</p>
                    <p>Our goal is to transform business information into a more adaptable and readily available resource.</p>
                    <p>We uphold the principle that information should be effortlessly obtainable through search.</p>
                    <p>Understanding that research is time-consuming, we recognize our clients' need for quick and targeted findings.</p>
                </div>
                <div className="about-section about-section2">
                    <p>Found a bug or have an idea?</p>
                    <p>Write us at <a href="mailto:support@nowreports.com">    
                            <span className="highlight-anim red-anim"> <strong>support@nowreports.com</strong>
                            </span>
                        </a>
                    </p>
                </div>
            </div>
        </section>

        <section id="new-features" mode="new-features" className={`landing-section ${mode == 'new-features' ? 'active' : ''}`} role="region" aria-label="New features section">
            <Thankyou hidden={!!!isSentFeatures}></Thankyou>
            <h1 className="text-medium">We're working on new features. Let us know what you need most.</h1>
            <h2 className="text-SM">Choose up to two features</h2>
            <div id="featurecard-container">
                {featuresData.map(feature => {
                    return   <Card className="max-w-sm feature-card clickable" key={feature.code} id={feature.code} onClick={selectFeature}>
                        <h5 className="text-2xl font-bold tracking-tight text-black-900 dark:text-black">
                            {feature.name}
                        </h5>
                        <p className="font-normal text-black-700 dark:text-black-400">
                            {feature.description}
                        </p>
                    </Card>
                })}

            </div>
                <div style={{width:'40vw'}}>
                    <h5 className="text-SM">Have another feature in mind? Write it here.</h5>
                    <Input.TextArea
                        onChange={ (a) => setCustomSuggestion(a.target.value) } 
                        placeholder="Write us your own suggestion"
                        autoSize={{ minRows: 2  , maxRows: 4 }}>

                    </Input.TextArea>
                </div>
                <Button disabled={!selectedFeatures.length && !customSuggestion.length} className="feature-send-btn" onClick={sendFeatures}>Send</Button>
        </section>

    </>
)
}

export default Landing;