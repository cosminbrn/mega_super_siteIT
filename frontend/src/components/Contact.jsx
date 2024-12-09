import React from 'react';
import background from '../assets/images/Group\ 90.png';

function Contact() {
    return (
        <section className="contact-section">
        <h2>Contact Us</h2>
          <form className="contact-form">
                <div className="form-column">
                    
                    <input type="text" id="first-name" name="first-name-contact" placeholder="First Name" required></input>
              
                    <p></p>
                    <input type="text" id="last-name" name="last-name" placeholder="Last Name" required></input>
      
                    <p></p>
                    <input type="email" id="email" name="email-contact" placeholder="Email" required></input>
                </div>
      
            <div className="form-column">
          
              <textarea id="message" name="message-contact" placeholder="Your message here..." required></textarea>
              
              
            </div>
            <div className="container-contact">
            <button type="submit" className="button-contact">Submit</button>
            </div>
        </form>
      </section>
    );
}

export default Contact;