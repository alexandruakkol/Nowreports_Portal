import React from 'react'

const Landing = () => {
    const onNavbarSectionChange = (e) => {
        const goto = e.target.getAttribute('goto');
        // if((goto === 'pitch') && paymentEl.current) {
        //     return paymentEl.current.scrollIntoView({ behavior: 'smooth' });
        // }
        window.location.href = window.location.origin + '/' + goto;
    };

  return (
    <>
        <nav id="landing-navbar" className="Navbar">
            <div id="navbar-mid-options">
                <span className="nav-button highlight-anim red-anim" goto='about' onClick={onNavbarSectionChange}>About Us</span>
                <span className="nav-button highlight-anim red-anim" goto='pitch' onClick={onNavbarSectionChange}>How we save you time</span>
            </div>

            <span id="goto-portal" className="highlight-anim red-anim" type="disabled" goto="login" onClick={onNavbarSectionChange}>Go to Portal</span>
          {/* <Menu onClick={onClick} selectedKeys={[LP_page]} mode="horizontal" items={items} /> */}
        </nav>
        <div id="landing-main">
            <div id="main-flex1"></div>
            <div id="main-flex2">
                <section className="home-section-a">
                    <div className="home-textarea">
                        <div id="main-text" className="font1">
                        <p>Get the information you<span id="main-red"> need</span></p>
                        <p id="main-gradient1">faster.</p>
                        <p id="main-gradient2">better.</p>
                        </div>
                    </div>
                </section>
            </div>          
            <div id="main-flex3">
                <p id="main-text2">Leverage AI to read company financial reports.</p>
            </div>
        </div>
    </>
)
}

export default Landing