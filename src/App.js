import "./App.css";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Experience from "./pages/Experience";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AboutDisplay from "./pages/AboutDisplay";
import Cv from "./pages/Cv";
import ScrollToTop from "./components/ScrollToTop";
import {Analytics} from "@vercel/analytics/react";
import {SpeedInsights} from "@vercel/speed-insights/react";

function App() {
    return (
        <div className="App">
            <Router>
                <Navbar/>
                <ScrollToTop/>
                <TransitionGroup component={null}>
                    <CSSTransition timeout={500} classNames="page" unmountOnExit>
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/about" element={<AboutDisplay/>}/>
                            <Route path="/projects" element={<Projects/>}/>
                            <Route path="/experience" element={<Experience/>}/>
                            <Route path="/cv" element={<Cv/>}/>
                        </Routes>
                    </CSSTransition>
                </TransitionGroup>
                <Footer/>
            </Router>
            <Analytics/>
            <SpeedInsights/>
        </div>
    );
}

export default App;