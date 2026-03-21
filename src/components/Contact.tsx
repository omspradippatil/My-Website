import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Location</h4>
            <p>Boisar, Maharashtra</p>
            <h4>Phone</h4>
            <p>
              <a href="tel:+919028915605" data-cursor="disable">
                +91 9028915605
              </a>
            </p>
            <h4>Email</h4>
            <p>
              <a href="mailto:omspradippatil@gmail.com" data-cursor="disable">
                omspradippatil@gmail.com
              </a>
            </p>
            <h4>Education</h4>
            <p>Diploma in Computer Engineering (SJCEM)</p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/omspradippatil"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Github <MdArrowOutward />
            </a>
            <a
              href="https://in.linkedin.com/in/om-pradip-patil"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Linkedin <MdArrowOutward />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Twitter <MdArrowOutward />
            </a>
            <a
              href="https://www.instagram.com/omspradippatil?igsh=MTVzYjhyNXdwd29hMw=="
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Instagram <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Om Pradip Patil</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
