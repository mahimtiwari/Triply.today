import React from 'react'
import Header from '../components/header';
import FormalPageComp from '../components/formalPageComp';
import Footer from '../components/footer';

export default function AboutPage() {
  return (
    <>
        <Header/>
        <FormalPageComp title="Terms of Service" lastUpdated="22nd July 2025">
          <p>Welcome to Triply.today! By using our services, you agree to comply with and be bound by the following terms and conditions.</p>
          <h2>Acceptance of Terms</h2>
          <p>By accessing or using our website, you agree to these terms. If you do not agree, please do not use our services.</p>
          <h2>Changes to Terms</h2>
          <p>We may update these terms from time to time. We will notify you of any changes by posting the new terms on this page.</p>
          <h2>User Responsibilities</h2>
          <p>You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>

        </FormalPageComp>
      <Footer/>

    </>
  );
}