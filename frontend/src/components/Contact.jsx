import React from 'react';
import background from '../assets/images/Group\ 90.png';
function Contact() {
    return (
    <section class="contact">
        <h2>Contact us</h2>
        <form id="contact-form">
            <div class="form-group">
                <input type="text" placeholder="First Name" required></input>
            </div>
            <div class="form-group">
                <input type="text" placeholder="Last Name" required></input>
            </div>
            <div class="form-group">
                <input type="email" placeholder="Email" required></input>
            </div>
            <div class="form-group">
                <textarea placeholder="Message" rows="5" required></textarea>
            </div>
            <button type="submit" class="submit-button">Submit</button>
        </form>
    </section>
    );
}

export default Contact;