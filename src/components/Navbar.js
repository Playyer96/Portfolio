import React, {useState, useEffect, useRef} from "react";
import "../styles/Navbar.css";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navbarRef = useRef(null);

    const toggleMenu = () => {
        setIsOpen((prevState) => !prevState);
    };

    // Close the menu if clicked outside
    const closeMenuOnClickOutside = (event) => {
        if (navbarRef.current && !navbarRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", closeMenuOnClickOutside);
        return () => {
            document.removeEventListener("click", closeMenuOnClickOutside);
        };
    }, []);

    return (
        <div className="Navbar" ref={navbarRef}>
            <span className="nav-logo">Dani</span>
            <div className={`nav-items ${isOpen ? "open" : ""}`}>
                <a href="/">Home</a>
                <a href="/projects">Projects</a>
                <a href="/cv">My cv</a>
                <a href="/experience">Experience</a>
            </div>
            <div
                className={`nav-toggle ${isOpen ? "open" : ""}`}
                onClick={toggleMenu}
            >
                <div className="bar"></div>
            </div>
        </div>
    );
};

export default Navbar;