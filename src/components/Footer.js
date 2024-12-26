import React, {useMemo} from "react";
import ContactIcons from "./ContactIcons";
import "../styles/Footer.css";

const Footer = () => {
    const currentYear = useMemo(() => new Date().getFullYear(), []);

    return (
        <footer className="footer">
            <div className="footer-content">
                <ContactIcons/>
                <div className="footer-text">
                    <p>
                        Made with ❤️ by <span className="footer-highlight">Danilo Vanegas - vanegasdanilo7@gmail.com</span>
                    </p>
                    <p>© {currentYear} All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;