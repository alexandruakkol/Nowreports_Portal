import React, {useState, useEffect} from 'react'
import './R_Navbar.css';
import { GiHamburgerMenu } from "react-icons/gi";

const R_Navbar = (props) => {
    const {items, logo_el, cta_button} = props;
    const [isListShown, setIsListShown] = useState(false);

    const reactElement = React.Children.only(cta_button);

    return (
    <nav className='rui-navbar'>
        <>{logo_el}</>
        <div className='rui-hamburger-container'>
            <GiHamburgerMenu className="rui-hamburger" onClick={() => {setIsListShown(!isListShown)}}/>
            <div className={`rui-hamburger-list ${isListShown ? 'open' : ''}`}>
                {items.map((item, index) => <div key={index} className="rui-hamburger-item">{item}</div>)}
                <div key={'last'} className={`rui-hamburger-item rui-cta-item`}>{reactElement}</div>
            </div>
        </div>
        <div className="rui-navbar-items">
            {items}
        </div>
        <div className="rui-cta">{cta_button}</div>
    </nav>
  );

}


export default R_Navbar