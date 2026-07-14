import Link from "next/link";

const Facebook = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const Twitter = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const Instagram = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);
const Youtube = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
);
const Linkedin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
);

export default function Footer() {
  return (
    <footer className="w-full bg-[#313035] text-gray-300 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Support Strip */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-600 pb-8 mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="text-[#f84464] bg-[#404043] p-3 rounded-full">
              <span className="font-bold text-xl">24/7</span>
            </div>
            <div>
              <p className="text-white font-semibold">CUSTOMER CARE</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="text-[#f84464] bg-[#404043] p-3 rounded-full">
              <span className="font-bold text-xl">RES</span>
            </div>
            <div>
              <p className="text-white font-semibold">RESEND BOOKING CONFIRMATION</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-[#f84464] bg-[#404043] p-3 rounded-full">
              <span className="font-bold text-xl">SUB</span>
            </div>
            <div>
              <p className="text-white font-semibold">SUBSCRIBE TO THE NEWSLETTER</p>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="text-sm mb-8 space-y-4">
          <div>
            <h4 className="text-gray-400 mb-2 uppercase text-xs font-bold tracking-wider">Movies Now Showing</h4>
            <div className="flex flex-wrap gap-2 text-gray-500">
              <Link href="/" className="hover:text-white transition">Spider-Man: Brand New Day</Link> | 
              <Link href="/" className="hover:text-white transition">The Odyssey</Link> | 
              <Link href="/" className="hover:text-white transition">Evil Dead Burn</Link> | 
              <Link href="/" className="hover:text-white transition">Obsession</Link>
            </div>
          </div>
        </div>

        {/* Logo & Socials */}
        <div className="flex flex-col items-center border-t border-gray-600 pt-8 mt-8">
          <div className="mb-6 opacity-80 filter invert brightness-0">
             <span className="text-3xl font-bold tracking-tighter">Cine<span className="text-[#f84464]">Verse</span></span>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="bg-gray-600 p-2 rounded-full hover:bg-white hover:text-gray-900 transition"><Facebook /></Link>
            <Link href="/" className="bg-gray-600 p-2 rounded-full hover:bg-white hover:text-gray-900 transition"><Twitter /></Link>
            <Link href="/" className="bg-gray-600 p-2 rounded-full hover:bg-white hover:text-gray-900 transition"><Instagram /></Link>
            <Link href="/" className="bg-gray-600 p-2 rounded-full hover:bg-white hover:text-gray-900 transition"><Youtube /></Link>
            <Link href="/" className="bg-gray-600 p-2 rounded-full hover:bg-white hover:text-gray-900 transition"><Linkedin /></Link>
          </div>
          
          <p className="text-xs text-gray-500 text-center max-w-3xl">
            Copyright 2026 © CineVerse Entertainment Pvt. Ltd. All Rights Reserved. <br/>
            The content and images used on this site are copyright protected and copyrights vests with the respective owners. The usage of the content and images on this website is intended to promote the works and no endorsement of the artist shall be implied.
          </p>
        </div>
        
      </div>
    </footer>
  );
}
