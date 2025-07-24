import React from 'react'
import Header from '../components/header';
import FormalPageComp from '../components/formalPageComp';
import Footer from '../components/footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Triply.today",
  description: "Contact details and support for Triply.today",
};


export default function ContactPage() {
  return (
    <>
        <Header/>
        <FormalPageComp title="Contact" lastUpdated="22nd July 2025">
          <p>
            If you have any questions, feedback, or need support, please reach out to us at:
          </p>

        </FormalPageComp>
      <Footer/>

    </>
  );
}
