import React, {useRef} from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Home() {
  const footerRef = useRef(null);

  const scrollToFooter = (e) => {
    e.preventDefault();
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Header */}
      <Header />

      {/* Main Hero Section */}
      <main className="pt-28 px-6 sm:px-12 md:px-20 bg-gray-50">
        <section className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Creating the Right Supply Chain Solution for our Customers
          </h1>
          <p className="text-lg text-gray-700 mb-10">
            Raywood Industries, LLC is a provider of comprehensive supply chain solutions.
            We offer a full suite of services, including warehousing, transportation,
            material handling, and value-added services.
          </p>
          <a
            href="#footer"
            onClick={scrollToFooter}
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-md shadow-md"
          >
            Contact Us
          </a>
        </section>
      </main>

      {/* About Section */}
      <section id="about" className="px-6 sm:px-12 md:px-20 py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About Us</h2>
          <p className="text-gray-700">
            Our team evaluates your supply chain requirements and engineers tailored
            solutions to meet your needs. With over 80 years of combined experience,
            we’re equipped to solve your toughest supply chain challenges.
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer ref={footerRef}/>
    </div>
  );
}
