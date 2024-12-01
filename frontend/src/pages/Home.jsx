import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Top from '../components/Top';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
function Home() {
  return (
    <div>
      <Hero />
      <Top />
      <Contact />
      <Footer />
    </div>
  );
}

export default Home;