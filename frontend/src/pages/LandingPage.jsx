import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

function LandingPage() {
    return (
        <div className="min-h-screen" dir="rtl">
            <Navbar />
            <main>
                <Hero />
                <About />
                <Contact />
            </main>
            <Footer />
        </div>
    );
}

export default LandingPage;
