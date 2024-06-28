import React from 'react'
import NavbarLayout from '../components/NavbarLayout';

export default function About (){
  return (
    <div>
        <NavbarLayout showNavbar={true}>
            <section id="about" className="landing-section active">
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
        </NavbarLayout>
    </div>
  )
}
