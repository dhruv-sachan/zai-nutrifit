import Navbar from "../components/navigation/Navbar";
import HeroSection from "../components/landing/HeroSection";
import BMIShowcaseSection from "../components/landing/BMIShowcaseSection";
import CoreFeaturesSection from "../components/landing/CoreFeaturesSection";
import AlternatingFeaturesSection from "../components/landing/AlternatingFeaturesSection";

// THIS IS THE LINE THAT WAS MISSING!
import PricingSection from "../components/landing/PricingSection";

import AboutSection from "../components/landing/AboutSection";
import ContactSection from "../components/landing/ContactSection";
// ... other imports ...
import CallToActionSection from "../components/landing/CallToActionSection";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-700">
      <Navbar />

      <HeroSection />

      <div id="bmi">
        <BMIShowcaseSection />
      </div>

      <div id="features">
        <CoreFeaturesSection />
        <AlternatingFeaturesSection />
      </div>

      {/* Now React knows what this is! */}
      <div id="pricing">
        <PricingSection />
      </div>

      {/* ... previous sections ... */}
      <div id="about">
        <AboutSection />
      </div>

      {/* UPDATE: Wrapped ContactSection in a div with id="contact" */}
      <div id="contact">
        <ContactSection />
      </div>

      <CallToActionSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
