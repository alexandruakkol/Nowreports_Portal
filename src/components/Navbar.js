import React, {useState, useEffect} from 'react'
import './Navbar.css';
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = (props) => {
    let {items, large_logo, small_logo, cta_button} = props;
    if(!small_logo) small_logo = large_logo;

    // --- check CTA
    let haveCTA = true;
    if(!cta_button) {
        haveCTA = false;
        cta_button = <></>;
    }

    const [isListShown, setIsListShown] = useState(false);
    const [logo, setLogo] = useState(small_logo);

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth >= 1000) {
                setLogo(large_logo);
            }
            else {
                setLogo(small_logo);
            }
        }

        handleResize();
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    },[]);
    console.log(cta_button)

    return (
    <nav className='rui-navbar'>
        <div className="rui-logo">{logo}</div>
        <div className='rui-hamburger-container'>
            {(items.length || haveCTA) ? <GiHamburgerMenu className="rui-hamburger" onClick={() => {setIsListShown(!isListShown)}}/> : <></>}
            <div className={`rui-hamburger-list ${isListShown ? 'open' : ''}`}>
                {items.map((item, index) => <div key={index} className="rui-hamburger-item">{item}</div>)}
                <div key={'last'} className={`rui-hamburger-item rui-cta-item`}>{cta_button}</div>
            </div>
        </div>
        <div className="rui-navbar-items">
            {items}
        </div>
        <div className="rui-cta">{cta_button}</div>
    </nav>
  );

}


export {Navbar}