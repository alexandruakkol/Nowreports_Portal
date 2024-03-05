import {useState, useRef} from 'react'
import Footer from '../components/Footer';
import { HiOutlineChevronDoubleDown } from "react-icons/hi";

const Landing = () => {

    const ALLOWED_MODES = ['pitch', 'about']
    const [mode, setMode] = useState('pitch'); //TODO: main
    const aboutRef = useRef();
    const pitchRef = useRef();

    const onNavbarSectionChange = (e) => {
        const goto = e.target.getAttribute('goto');
        if(ALLOWED_MODES.includes(goto)) return setMode(goto);
        else window.location.href = window.location.origin+goto;
    };

    function onLogoClick(){
        setMode('pitch');
    }

    function selectedClass(ref){
        if(!ref.current) return;
        const currentSelection = ref.current.getAttribute('goto');
        if(currentSelection == mode)
            return 'selected-button';
    }

  return (
    <>
        <nav id="landing-navbar" className="Navbar">
            <img id="landing-navbar-logo" src="nr_full_logo_black.svg" alt="Now Reports Logo" onClick={onLogoClick}></img>
            
            <div id="navbar-mid-options">
                <span className={`nav-button highlight-anim red-anim ${selectedClass(aboutRef)}`} goto='about' ref={aboutRef} onClick={onNavbarSectionChange}>About Us</span>
                <span className={`nav-button highlight-anim red-anim ${selectedClass(pitchRef)}`} goto='pitch' ref={pitchRef} onClick={onNavbarSectionChange}>How we save you time</span>
            </div>

            <a id="goto-portal" className="highlight-anim red-anim nowrep-button" type="disabled" href="/signup">
                {mode == 'main' ? 'Go to Portal' : 'Try NowReports AI'}
            </a>
        </nav>
        {/* ----------------- MAIN MODE ----------------- */}
        <section mode="main" className={`landing-section ${mode == 'main' ? 'active' : ''}`}>
            <div id="landing-main">
                <div id="main-flex1"></div>
                <div id="main-flex2">
                    <section className="home-section-a">
                        <div className="home-textarea">
                            <div id="main-text">
                                <p>
                                    <span className="highlight-anim red-anim">
                                        <span className="main-text-p">Get the information you</span>
                                        <span id="main-red" className="main-text-p"> need</span>
                                    </span>
                                </p>
                            
                            <p>
                                <span className="highlight-anim red-anim main-text-p">faster.</span>
                                </p>
                            <p>
                                <span className="highlight-anim red-anim main-text-p">better.</span>
                                </p>
                            </div>
                        </div>
                    </section>
                </div>          
                <div id="main-flex3">
                    <p id="main-text2">Leverage AI to analyze company financial reports.</p>
                </div>
            </div>
        </section>

        {/* ----------------- PITCH MODE ----------------- */}

        <section id="pitch" mode="pitch" className={`landing-section ${mode == 'pitch' ? 'active' : ''}`}>
            <div className="heading-element">
                <div className="heading-container">
                    <div className="heading heading-title text-center">
                        <span>Turn 10-K reports into </span> 
                        <span className="blue-text-accent">quick information</span></div>
                    <div className="heading heading-subtitle text-center">with state of the art AI.</div>
                    <div className="heading-subtitle text-center heading-third text-medium">Ask questions as if you were talking to the board itself.</div>
                </div>

                <div id="main-goto-portal">
                    <a id="goto-portal" className="highlight-anim red-anim nowrep-button" type="disabled" href="/signup">
                        {mode == 'main' ? 'Go to Portal' : 'Try NowReports AI'}
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

                        <div className="pitch-title">Find red flags in no time.</div>
                        <div className="typing typing-anim1 typing_freq4 message">What does the company need the large amount of debt for?</div>
                        <div className="delayed-text typing_response message ai-message-msg">The company has incurred significant net losses in each year since its inception. This history of losses indicates that the company is not generating enough revenue to cover its expenses and fund its operations. Additionally, the company is dependent on future performance for servicing its debt, which is subject to economic, financial, competitive, and other uncontrollable factors.</div>
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
                    <div className="pitch-text"><b></b></div>
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
        <section id="about" mode="about" className={`landing-section ${mode == 'about' ? 'active' : ''}`}>
            <div id="about-container">
                <div className="about-section about-section1">
                    <p>Our focus is on improving financial research processes through software solutions.</p>
                    <p>We are on a mission to make financial research more flexible.</p>
                    <p>Researching takes a long time, and our clients know what they are looking for.</p>
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


    </>
)
}

export default Landing;