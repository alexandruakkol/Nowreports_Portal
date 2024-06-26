// OUT-OF-LOGIN NAVBAR
import React from 'react'

const Navbar_out = (props) => {
  return (
    <nav id="signup-navbar" className="Navbar">
      <img id="signup-navbar-logo" src="CEOChat_combo.png" onClick={()=>{window.location.href = window.location.origin}}></img>
     
      {props?.page != 'login' && <span id="goto-portal" className="highlight-anim red-anim nowrep-button" 
          onClick={()=>{window.location.href = window.location.origin+'/login'}} 
          type="disabled" goto="login">
          Go to Login
      </span>}

    </nav>
  )
}

export default Navbar_out