import {Navbar} from "readyui";
import Link from "next/link";

const logo = <h2 className="logo-text main-logo">CEO Chat</h2>;

const cta = <div className="flex-row" style={{gap:'15px'}}>   
    <button className="login-btn highlight-anim red-anim-light" onClick={() => {window.location.pathname='/login'}}>Log in</button>
    <button className="nowrep-menu nowrep-signup darken-button" type="disabled" 
        onClick={() => {window.location.pathname='/signup'}}>
        Sign up
    </button>
    </div>

const items = [
    <Link href="/"><span className={`nav-button highlight-anim red-anim-light`} >Home</span></Link>,
    <Link href="/about"> <span className={`nav-button highlight-anim red-anim-light`}>About Us</span></Link>,
    // <span className={`nav-button highlight-anim red-anim-light ${(selectedNavbar === 'new-features') && 'selected-button'}`} goto='new-features' ref={featuresRef} onClick={onNavbarSectionChange}>New features</span>,
]

export default function Layout({ children, showNavbar }) {
  return (
    <>
      <>{showNavbar && <Navbar large_logo={logo} small_logo={logo} items={items} cta_button={cta}></Navbar>}</>
      <div className="Main-noNavbar">{children}</div>
    </>
  );
}
