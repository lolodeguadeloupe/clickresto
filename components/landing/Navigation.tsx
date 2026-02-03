"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 flex justify-between items-center bg-clickresto-background/95 backdrop-blur-md border-b border-clickresto-secondary/10">
      <Link href="/" className="flex items-center gap-2 text-clickresto-primary font-serif text-2xl no-underline">
        <div className="w-10 h-10 bg-clickresto-primary rounded-lg flex items-center justify-center text-white text-xl">
          <span role="img" aria-label="restaurant">🍽️</span>
        </div>
        Clickresto
      </Link>

      <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex absolute md:relative top-full md:top-auto left-0 right-0 md:left-auto md:right-auto flex-col md:flex-row gap-4 md:gap-8 items-center bg-clickresto-background md:bg-transparent p-4 md:p-0 shadow-lg md:shadow-none`}>
        <Link href="#fonctionnalites" onClick={closeMenu} className="text-clickresto-secondary font-medium hover:text-clickresto-primary transition-colors py-2 md:py-0 border-b md:border-b-0 border-gray-200 w-full md:w-auto text-center md:text-left">
          Fonctionnalités
        </Link>
        <Link href="#temoignages" onClick={closeMenu} className="text-clickresto-secondary font-medium hover:text-clickresto-primary transition-colors py-2 md:py-0 border-b md:border-b-0 border-gray-200 w-full md:w-auto text-center md:text-left">
          Témoignages
        </Link>
        <Link href="#tarifs" onClick={closeMenu} className="text-clickresto-secondary font-medium hover:text-clickresto-primary transition-colors py-2 md:py-0 border-b md:border-b-0 border-gray-200 w-full md:w-auto text-center md:text-left">
          Tarifs
        </Link>
        <Link href="#affiliation" onClick={closeMenu} className="text-clickresto-secondary font-medium hover:text-clickresto-primary transition-colors py-2 md:py-0 border-b md:border-b-0 border-gray-200 w-full md:w-auto text-center md:text-left">
          Affiliation
        </Link>
        <Link
          href="#contact"
          onClick={closeMenu}
          className="inline-flex items-center gap-2 px-6 py-3 bg-clickresto-primary text-white rounded-full font-semibold hover:bg-[#c41e2d] transition-all hover:-translate-y-0.5 shadow-lg shadow-clickresto-primary/30"
        >
          Demander une démo
        </Link>
      </div>

      <button
        className="md:hidden text-2xl text-clickresto-secondary bg-transparent border-none cursor-pointer"
        onClick={toggleMenu}
        aria-label="Menu"
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? '✕' : '☰'}
      </button>
    </nav>
  );
}
