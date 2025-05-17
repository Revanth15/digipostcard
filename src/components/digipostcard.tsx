"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import frontImg from '../../public/front.png'
import backImg from '../../public/kissy.avif'

const GoogleFonts = () => {
  useEffect(() => {
    const existingLink = document.querySelector('link[href*="fonts.googleapis.com/css2?family=Allison&family=Caesar+Dressing&family=Staatliches"]');
    if (existingLink) return;

    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Allison&family=Caesar+Dressing&family=Staatliches&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const preconnect1 = document.createElement('link');
    preconnect1.href = "https://fonts.googleapis.com";
    preconnect1.rel = "preconnect";
    document.head.appendChild(preconnect1);

    const preconnect2 = document.createElement('link');
    preconnect2.href = "https://fonts.gstatic.com";
    preconnect2.rel = "preconnect";
    preconnect2.setAttribute("crossorigin", "true");
    document.head.appendChild(preconnect2);

    return () => {
        // Optional: cleanup if component unmounts, though for fonts it's often fine to leave them
        // document.head.removeChild(link);
        // document.head.removeChild(preconnect1);
        // document.head.removeChild(preconnect2);
    }
  }, []);
  return null;
};

interface DigitalPostcardProps {
  fromNameOnFront?: string;
  toAddress?: string;
  greeting?: string;
  messageLine1?: string;
  messageLine2?: string;
  messageLine3?: string;
  messageLine4?: string;
  closingRegards?: string;
  postcardTitle?: string;
}

const DigitalPostcard: React.FC<DigitalPostcardProps> = ({
  fromNameOnFront = "Zagreus",
  toAddress = "The Underworld, Hades Manor",
  greeting = "Dearest Zagreus,",
  messageLine1 = "Wishing You a Fantastic Birthday!",
  messageLine2 = "Don't drink all of Dionysus' wine!",
  messageLine3 = "Hope you have a truly memorable day.",
  messageLine4 = "See you at the feast later!",
  closingRegards = "Regards, Zeus",
  postcardTitle = "SENT THROUGH HERMES"
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // SVG background pattern from your original CSS
  const svgBackground = "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"20\" viewBox=\"0 0 100 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z\" fill=\"%239C92AC\" fill-opacity=\"0.4\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')";

  const fontStaatliches = { fontFamily: '"Staatliches", cursive' };
  const fontCaesarDressing = { fontFamily: '"Caesar Dressing", cursive' };
  const fontAllison = { fontFamily: '"Allison", cursive' };

  return (
    <div
      className="w-[700px] h-[386px] relative group cursor-pointer rounded-md"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      {/* Front of the card */}
      <div
        className="absolute w-full h-full top-0 left-0 transition-transform duration-700 ease-in-out backface-hidden rounded-md shadow-xl bg-white border border-gray-300"
        style={{ transformStyle: 'preserve-3d', transform: `rotateY(${isFlipped ? '180deg' : '0deg'})` }}
      >
        <Image src={frontImg} alt="My Image" 
        className='absolute w-full h-full top-0 left-0 transition-transform duration-700 ease-in-out backface-hidden rounded-md shadow-xl bg-white border border-gray-300'/>
        <div
          className="absolute top-[40px] left-[20px] select-none"
          style={{ transform: 'rotate(-10deg)' }}
        >
          <p className="text-3xl text-center text-white" style={fontCaesarDressing}>FROM</p>
          <h2 className="text-[80px] font-normal pl-[30px] leading-none text-white" style={fontCaesarDressing}>
            {fromNameOnFront}
          </h2>
        </div>
      </div>

      {/* Back of the card */}
      <div
        className="absolute w-full h-full top-0 left-0 transition-transform duration-700 ease-in-out backface-hidden rounded-md shadow-xl bg-gray-200"
        style={{ transformStyle: 'preserve-3d', transform: `rotateY(${isFlipped ? '0deg' : '-180deg'})` }}
      >
        <div className="m-[10px] bg-white h-[calc(100%-20px)] rounded-sm p-1">
          <div className="flex justify-between items-start pt-5 px-6 pb-0">
            <h1 className="text-[30px] leading-tight mt-1" style={fontCaesarDressing}>
              {postcardTitle}
            </h1>
            <Image src={backImg} alt="My Image" 
            className="w-[70px] h-[70px] relative top-[-15px] right-[-5px] flex-shrink-0"
            style={{ transform: 'rotate(5deg)' }}
            />
          </div>
          <div className="px-6 mt-[-10px]">
            <p className="text-[30px] text-[#c62828] m-0 leading-tight" style={fontAllison}>
              <strong className="text-lg text-[#252525] mr-[15px]" style={fontStaatliches}>SEND TO:</strong>
              {toAddress}
            </p>
          </div>
          <div className="pt-4 px-[30px] space-y-1">
            <p className="border-b border-gray-200 text-[28px] text-[#c62828] m-0 pl-[40px] leading-snug" style={fontAllison}>{greeting}</p>
            <p className="border-b border-gray-200 text-[26px] text-[#c62828] m-0 pl-[65px] leading-snug" style={fontAllison}>{messageLine1}</p>
            <p className="border-b border-gray-200 text-[26px] text-[#c62828] m-0 pl-[65px] leading-snug" style={fontAllison}>{messageLine2}</p>
            <p className="border-b border-gray-200 text-[26px] text-[#c62828] m-0 pl-[65px] leading-snug" style={fontAllison}>{messageLine3}</p> 
            <p className="border-b border-gray-200 text-[26px] text-[#c62828] m-0 pl-[65px] leading-snug" style={fontAllison}>{messageLine4}</p> 
            <p className="text-[28px] text-[#c62828] m-0 pl-[350px] text-right leading-snug pt-1" style={fontAllison}>{closingRegards}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const svgBackground = "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"20\" viewBox=\"0 0 100 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z\" fill=\"%239C92AC\" fill-opacity=\"0.4\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')";
  const fontStaatliches = { fontFamily: '"Staatliches", cursive' };

  return (
    <>
      <GoogleFonts />

      <div
        className="flex flex-col justify-center items-center min-h-screen py-10 px-4 bg-gray-100"
        // style={{ backgroundImage: svgBackground, ...fontStaatliches }}
      >

        <DigitalPostcard
          fromNameOnFront="rev"
          toAddress="To my favourite human being"
          greeting="My love,"
          messageLine1="I just wanted to wish you the bestest birthday. Happy 21 my love, you truly are"
          messageLine2="one phenomenal human being. I am proud of you and i am proud to call you my partner!"
          messageLine3="I love my life when I am with you, you are the biggest blessing in anyone's life"
          messageLine4="I loveeeeeeeeee you Ruri, wholeheartedly"
          closingRegards="Kachoooooow, rev"
          postcardTitle="Rev's little messenger"
        />

      </div>
    </>
  );
}