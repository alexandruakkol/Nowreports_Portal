import { useState, useRef, useEffect } from 'react'
import Footer from '../../../src/components/Footer';
import { FaRegCheckCircle } from "react-icons/fa";
import { Card, Button } from 'flowbite-react';
import axios from 'axios';
import Thankyou from '../../../src/components/Thankyou';
import { Input, Modal } from 'antd';
import {Navbar} from 'readyui';
import { LuPlay } from "react-icons/lu";
import { IoCheckmarkDone } from "react-icons/io5";
import ReactPlayer from 'react-player/lazy'
import PitchCard from '../../../src/components/PitchCard';
import PitchcardList from '../../../src/components/PitchcardList';

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleVidOK = () => {
        setIsModalOpen(false);
    };
    const handleVidCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if((mode === 'new-features') && (!featuresData.length) ){ // only calls on newfeatures mode
            axios.get(`${window.appdata.API_ADDR}/features`)
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

    const pitchcardTags_techniques = ['financial metric recognition and computation', 'NLP analysis and classificiation'];
    const pitchcardTags_scans = ['key contracts', 'lawsuits', 'new ventures'];

    const items = [
        <span className={`nav-button highlight-anim red-anim-light ${(selectedNavbar === 'pitch') && 'selected-button'}`} goto='pitch' ref={pitchRef} onClick={onNavbarSectionChange}>Home</span>,
        <span className={`nav-button highlight-anim red-anim-light ${(selectedNavbar === 'about') && 'selected-button'}`} goto='about' ref={aboutRef} onClick={onNavbarSectionChange}>About Us</span>,
        // <span className={`nav-button highlight-anim red-anim-light ${(selectedNavbar === 'new-features') && 'selected-button'}`} goto='new-features' ref={featuresRef} onClick={onNavbarSectionChange}>New features</span>,
    ]

    const cta = <div className="flex-row" style={{gap:'15px'}}>   
                    <button className="login-btn highlight-anim red-anim-light" onClick={() => {window.location.pathname='/login'}}>Log in</button>
                    <button className="nowrep-menu nowrep-signup darken-button" type="disabled" 
                        onClick={() => {window.location.pathname='/signup'}}>
                        Sign up
                    </button>
                </div>
              

    // const small_logo = <img 
    //     style={{width: '3.3rem'}} 
    //     alt="CEOChat Logo" src='./ceochat_logo.png'></img>; //TODO: onClick={onLogoClick}

    // const large_logo = <img 
    //     style={{width: '12rem'}}
    // alt="CEOChat Logo" src='./CEOChat_combo_inline_black.png'></img>; //TODO: onClick={onLogoClick}

    const logo = <h2 className="logo-text main-logo">CEO Chat</h2>;

  return (
    <>
        <Navbar large_logo={logo} small_logo={logo} items={items} cta_button={cta}></Navbar>

        {/* ----------------- MAIN MODE ----------------- */}

        {/* ----------------- PITCH MODE ----------------- */}

        <section id="pitch" mode="pitch" className={`landing-section ${mode == 'pitch' ? 'active' : ''}` } role="region" aria-label="Main section">
            <Modal cancelButtonProps={{hidden:true}} width={'90vw'} id="demo-vid-container" open={isModalOpen} onOk={handleVidOK} onCancel={handleVidCancel}>
                <ReactPlayer width={'100%'} height={'83vh'} url='https://ceochat.nowreports.com/api/demo_video.mp4' controls={true} playing={true}/>
            </Modal>
            <div className="heading-element custom-purple-bkg">
                <div className="heading-container">
                    <div className="heading heading-title text-center">
                        <p>Chat with the virtual CEO</p><p>of a company using AI</p><span className="blue-text-accent-commented">  </span></div>
                        <p className="text-medium text-center heading-secondary text-white80">Get factual business insights through our highly specialized AI models.</p>
                    {/* <div className="heading heading-subtitle text-center">with state of the art AI.</div> */}
                    <div className="heading-subtitle text-center heading-third text-medium">
                        {/* <p className="text-smallm">
                            Get instant answers to your business-related questions, as if you were talking to the board themselves.
                        </p>
                        <p className="text-smallm">
                            Learn more about a company, in less time.
                        </p>
                        <p className="text-smallm">
                            Use AI on 10-K reports.
                        </p> */}
                    </div>
             
                </div> 
                <div className="flex-row main-cta-container">
                    <div id="main-goto-portal">
                            <a className="goto-portal nowrep-button darken-button" type="disabled" href="/signup">
                                Get Started for free
                            </a>
                        </div>
                        <div id="main-goto-portal">
                            <a id="main-goto-demo" className="nowrep-button darken-button" type="disabled" onClick={()=>setIsModalOpen(true)}>
                                <LuPlay></LuPlay>See a demo video
                            </a>
                    </div>
                </div>
                <div className="text-white80 no-cc text-center flex-row"><IoCheckmarkDone></IoCheckmarkDone> No credit card required.</div>

                <div id="benefits-list">
                    <div className="horiz-benefit"></div>
                </div>
            </div>

            <img src="skeletons/mobile_sk.svg" className="mobile-only main-sk" alt="background pattern"></img>
            <div className="desktop-only main-sk" id="main-desktop-sk">
                <img src="skeletons/side_sk.svg" className="main-sk" alt="background pattern"></img>
                <img src="skeletons/main_sk.svg" className="main-sk" alt="background pattern"></img>
                <img src="skeletons/side_sk.svg" className="main-sk" alt="background pattern"></img>
            </div>
            
            {/* <div className="activity-pitch flex-column">
                <div className="main-pitch heading heading-title text-center">What we do</div>
                <div className="text-center pitch-subtitle">
                    We provide factual business insights through our highly specialized, fine-tuned AI models.
                </div>

            </div> */}
            <div className="activity-pitch flex-column results-div">
                <div className="main-pitch heading heading-title text-center">Why we're better at this than ChatGPT:</div>

                <div className="pitchcard-container">
                    <PitchcardList>
                        <PitchCard title="Automatic updates">We sustain a continous process of keeping the knowledge base up to date with the 500 largest U.S companies. You always get the latest information, all in one place.</PitchCard>
                        <PitchCard title="Business scans" tags={pitchcardTags_scans}>Our AI scanner is able to generate a report highliting key business concerns. The report model was co-created with finance experts.</PitchCard>
                        <PitchCard title="AI models">Our specialized AI models are uniquely equipped with deep insights into financial reporting, accounting, and business.</PitchCard>
                        <PitchCard title="AI augmentation" tags={pitchcardTags_techniques}>We integrate unique techniques that help generate the most accurate and insightful answers. Engineering alongside AI.</PitchCard>
                        <PitchCard title="Specific knowledge base">We centralize data from various SEC filings and call transcripts, and use it to build our AI-oriented knowledge base.</PitchCard>
                    </PitchcardList>
                </div>
            </div>

            <div className="activity-pitch activity-pitch2 flex-column">
                <div className="main-pitch heading heading-title text-center gain-title">What you gain</div>
                <div className="pitch-subtitle text-center">
                    The ability to ask quick questions to the virtual CEO of a publicly traded company, and get instant answers.
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
                        <div className="delayed-text typing_response message ai-message-msg">The company plans to allocate $8,843 million of its cash towards the creation of new self-storage units. Therefore, it seems that the company is addressing the excess amount of cash and has plans for utilizing it effectively.</div>
                    </div>
                    <div className="pitch-text"></div>
                </div>

                <div className="pitch-element">
                    <div className="pitch-element-body">
                        <div className="pitch-title">Gain complex insights, effortlessly.</div>
                        <div className="typing typing-anim1 typing_freq4 message">What does the company invest the most in? How much is it, as % of net income?</div>
                        <div className="delayed-text typing_response message ai-message-msg">The company invests the most in equity investments (securities and privately held companies), totaling $1,834 million. This represents approximately 88% of the net income.</div>
                    </div>
                </div>

                <div className="pitch-element">
                    <div className="pitch-element-body">

                        <div className="pitch-title">Get the big picture.</div>
                        <div className="typing typing-anim1 typing_freq4 message">What does the company need the large amount of debt for?</div>
                        <div className="delayed-text typing_response message ai-message-msg">The company has incurred significant net losses in each year since its inception. This history of losses indicates that the company is not generating enough revenue to cover its expenses and fund its operations. Additionally, the company is dependent on future performance for servicing its debt, which is subject to economic, financial, competitive, and other uncontrollable factors.</div>
                    </div>
                </div>


                {/* <Footer></Footer> */}
            </div>

            <div className="why-pitch-element flex-column">
                <div className="why-pitch-title main-pitch heading heading-title text-center gain-title">Why investors love our AI tool</div>
                <div className="flex-row why-pitch-container" style={{'justifyContent': 'center'}}>
                    <div>
                        <ul>
                            <li><div className="flex-row why-li text-smallm"><FaRegCheckCircle className="why-li-icon"/>It's faster and easier than digging through Google.</div></li>
                            <li><div className="flex-row why-li text-smallm"><FaRegCheckCircle className="why-li-icon"/>It's the next best thing to chatting with company management.</div></li>
                            <li><div className="flex-row why-li text-smallm"><FaRegCheckCircle className="why-li-icon"/>No more corporate lingo. We can identify the green flags and the red ones.</div></li>
                            <li><div className="flex-row why-li text-smallm"><FaRegCheckCircle className="why-li-icon"/>Get your information the exact way you want it. Phrase your concerns your way.</div></li>
                        </ul>
                    </div>
                    <div>
                        <img src='/skeletons/secondary.svg' alt="background pattern"></img>
                    </div>
                </div>
            </div>

            <div>
                <div className="final-ctadiv-container">
                    <div className="final-ctadiv">
                        <div className="flex-column flex-center">
                            <p className="text-white ctadiv-text1">Get instant answers to your</p>
                            <p className="text-white ctadiv-text1">business related questions</p>
                        </div>
                        <div style={{marginTop:'30px', marginBottom:'30px'}}>
                            <p className="text-smallm text-center text-white80">Get started for free and subscribe for only $6.99 per month</p>
                            {/* //todo: make this dynamic (price) */}
                        </div>
                        <a className="goto-portal nowrep-button darken-button" type="disabled" href="/signup">
                            Sign up now
                        </a>
                    </div>
                </div>
            </div>

            <div className="flex-row" style={{justifyContent:'center'}}>
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
                   
                    <b className="text-center ">Our Mission</b>

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
            <h2 className="text-smallm">Choose up to two features</h2>
            <div id="featurecard-container">
                {featuresData.map(feature => {
                    return   <Card className="max-w-sm feature-card clickable feature-cardtext" key={feature.code} id={feature.code} onClick={selectFeature}>
                        <h5 className="font-bold tracking-tight text-black-900 dark:text-black">
                            {feature.name}
                        </h5>
                        <p className="font-normal text-black-700 dark:text-black-400">
                            {feature.description}
                        </p>
                    </Card>
                })}

            </div>
                <div style={{width:'40vw'}}>
                    <h5 className="text-smallm">Have another feature in mind? Write it here.</h5>
                    <Input.TextArea
                        onChange={ (a) => setCustomSuggestion(a.target.value) } 
                        placeholder="Write us your own suggestion"
                        autoSize={{ minRows: 2  , maxRows: 4 }}>

                    </Input.TextArea>
                </div>
                <Button disabled={!selectedFeatures.length && !customSuggestion.length} className="feature-send-btn main-blue-bkg" onClick={sendFeatures}>Send</Button>
        </section>

    </>
)
}

export default Landing;