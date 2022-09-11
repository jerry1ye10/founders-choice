import Image from "next/image";
import logo from "../public/logo.svg";
import { useRef, useState, useEffect } from "react";
import CompletedComparisons from "./ranking";

export async function getStaticProps() {
  const { db } = require("../utils/firebase");
  const rawRows = await db.collection("Investors").orderBy("elo").get();
  const labeledRows = rawRows.docs
    .map((e) => {
      const { name, image = "", numComparisons, elo } = e.data();
      return {
        name,
        image,
        numComparisons,
        elo,
      };
    })
    .filter((e) => e.numComparisons > 25)
    .sort((a, b) => parseInt(b.elo) - parseInt(a.elo))
    // .filter((e) => e.image !== "")
    .map((e, i) => ({ ...e, index: i + 1 }));

  return {
    props: { data: labeledRows },
  };
}

export default function Home({ data = [] }) {
  const scrollTarget = useRef(null);
  const scrollTo = () => scrollTarget?.current?.scrollIntoView?.();

  return (
    <>
      <div className="text-center px-5 w-screen flex-col flex sm:block hidden" >
        <div className="w-full z-50 items-center" style={{ 
        paddingTop: "12vw",
        paddingBottom: "12vw",
        backgroundImage: "url('/logo.svg')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '100% 100%',
       }}>
          <h1 className="w-full relative montserrat text-3xl sm:text-7xl font-semibold">
            Founder's Choice
          </h1>
          <h2 className="container mx-auto relative raleway text-2xl sm:text-4xl font-extralight mt-8 z-50">
            <span inline-block>
              A VC firm ranking, generated anonymously and verifiably,
            </span>
            <br />
            <span inline-block> by founders, for founders</span>
          </h2>
          <button
            className="relative top-12 z-50 raleway font-light text-xl sm:text-4xl bg-white rounded-full border-2 border-black p-8 py-4"
            onClick={scrollTo}
          >
            View Rankings
          </button>
        </div>
      </div>
      <div ref={scrollTarget}>
        <CompletedComparisons data={data} />
      </div>
    </>
  );
}
