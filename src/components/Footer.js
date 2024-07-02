import React from 'react'
import { Footer } from 'flowbite-react';

const r_Footer = (props) => {

  const fn_goto_about = props.fn_goto_about || (()=>{});
  return (
    <>
    <Footer.Divider />
    <Footer container id="footer">
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div className="flex-column footer-logotext">
            <Footer.Brand
              src="CEOChat_combo_inline_black.png"
              alt="CEO Chat logo"
              style={{ height: '5rem'}}
            />
             <div>
              <p>Found a bug or have an idea?</p>
              <p>Email us at support@nowreports.com</p>
            </div>
          </div>
          <div className="flex-row footer-categs">
            <div>
              <Footer.Title title="about" />
              <Footer.LinkGroup col>
                <Footer.Link onClick={fn_goto_about} href="#" className="footer-link">CEO Chat</Footer.Link>
              </Footer.LinkGroup>
            </div>
            {/* <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Github</Footer.Link>
                <Footer.Link href="#">Discord</Footer.Link>
              </Footer.LinkGroup>
            </div> */}
            {/* <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div> */}
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href="#" by="CEO Chat. All rights reserved." year={(new Date()).getFullYear()} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            {/* <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="#" icon={BsGithub} />
            <Footer.Icon href="#" icon={BsDribbble} /> */}
          </div>
        </div>
      </div>
    </Footer>
    </>

  )
}

export default r_Footer