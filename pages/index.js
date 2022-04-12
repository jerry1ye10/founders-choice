import Image from "next/image";
import Login from "./login"
import logo from "../public/logo.svg";
import { useRef } from "react";

export default function Home() {
  const scrollTarget = useRef(null);
  const scrollTo = () => scrollTarget && scrollTarget?.current?.scrollIntoView();
  return (
    <>
      <div className="text-center px-5 h-screen w-screen">
        <div className="absolute w-full z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="w-full relative montserrat text-5xl sm:text-7xl font-semibold">
            Founder’s Choice
          </h1>
          <h2 className="container mx-auto relative raleway text-4xl font-extralight mt-8 z-50">
            <span inline-block>
              A VC firm ranking, generated anonymously and verifiably,
            </span>
            <br />
            <span inline-block>
              {" "}by founders, for founders
            </span>
          </h2>
          <button
            className="relative top-12 z-50 raleway font-light text-4xl bg-white rounded-full border-2 border-black p-8 py-4"
            onClick={scrollTo}
          >
            Contribute Rankings
          </button>
        </div>
        <div className="z-0 w-4/5 sm:w-2/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Image src={logo} />
        </div>
      </div>
      <div ref={scrollTarget}>
        <Login />
      </div>
    </>
  );
}
