import React from "react";

// ✅ Correct imports
import Header from "../components/Header";
import NavbarComp from "../components/NavbarComp";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton"; 

const UserLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <NavbarComp />
      <main style={{ flex: 1 }}>{children}</main>
      <WhatsAppButton /> 
      <Footer />
    </div>
  );
};

export default UserLayout;

