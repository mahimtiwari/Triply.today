import React from 'react'
import Header from '../components/header';
import FormalPageComp from '../components/formalPageComp';
import Footer from '../components/footer';

export default function AboutPage() {
  return (
    <>
        <Header/>
        <FormalPageComp title="About Us" lastUpdated="22nd July 2025">
          <p>Welcome to Triply.today, your go-to platform for planning and organizing your trips effortlessly.</p>
          <p>Our mission is to simplify travel planning by providing a user-friendly interface and powerful tools to help you create the perfect itinerary.</p>
          <h2>Our Story</h2>
          <p>Founded in 2023, Triply.today was born out of a passion for travel and a desire to make trip planning accessible to everyone.</p>
          <h2>Contact Us</h2>
          <p>If you have any questions or feedback, feel free to reach out to us through our contact page.</p>
        </FormalPageComp>
      <Footer/>
    </>
  );
}