import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../utils'; 
import { Element, scroller } from 'react-scroll'; 

import Navbar from '../components/Navbar';
import Home from '../components/Home'; 
import ScrollingWords from '../components/ScrollingWords';
import About from '../components/About';
import KeyFeatures from '../components/KeyFeatures';
import GetStarted from '../components/GetStarted'; 
import Team from '../components/Team'; 
import Footer from '../components/Footer';

function Dashboard() {
  const navigate = useNavigate();

  const scrollToSection = (name, offset) => {
    scroller.scrollTo(name, {
      duration: 600,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset: offset, 
    });
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Logged out');
    setTimeout(() => {
      navigate('/login'); 
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar
        scrollToHome={() => scrollToSection('home', -30)} 
        scrollToAbout={() => scrollToSection('about', -10)}
        scrollToFeatures={() => scrollToSection('features', -140)} 
        scrollToGetStarted={() => scrollToSection('getstarted', -30)}
        scrollToTeam={() => scrollToSection('team', -120)}
        handleLogout={handleLogout}
      />
      <div className="pt-20">
        <Element name="home"> 
          <Home />
        </Element>
        <div className="mt-12">
          <ScrollingWords />
        </div>
        <Element name="about" className="mt-24">
          <About />
        </Element>
        <Element name="features" className="mt-24">
          <KeyFeatures />
        </Element>
        <Element name="getstarted" className="mt-24"> {/* Another section, named 'getstarted' */}
          <GetStarted />
        </Element>
        <Element name="team" className="mt-24">
          <Team />
        </Element>
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;
