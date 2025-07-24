import React from 'react'
import Header from '../components/header';
import FormalPageComp from '../components/formalPageComp';
import Footer from '../components/footer';

export default function AboutPage() {
  return (
    <>
        <Header/>
        <FormalPageComp title="Privacy Policy" lastUpdated="22nd July 2025">
          
          <p>This is the privacy policy for Triply.today, effective from 22nd July 2025.</p>
          <p>We value your privacy and are committed to protecting your personal information. This policy outlines how we collect, use, and safeguard your data.</p>
          <h2>Information Collection</h2>
          <p>We collect information that you provide directly to us, such as when you create an account, contact us, or use our services.</p>
          <h2>Use of Information</h2>
          <p>Your information is used to provide and improve our services, communicate with you, and comply with legal obligations.</p>
          <h2>Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information from unauthorized access or disclosure.</p>
        </FormalPageComp>
        <Footer/>
    </>
  );
}