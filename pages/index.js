import Image from "next/image";
import logo from "../public/logo.svg";
import { useRef, useState, useEffect } from "react";
import CompletedComparisons from "./ranking";

export async function getStaticProps() {
  const { db } = require("../utils/firebase");
  const rawRows = await db.collection("Investors").orderBy("elo").get();
  const labeledRows = rawRows.docs
    .map((e) => {
      const { name, image = "", numComparisons, elo, uniqueCount } = e.data();
      return {
        name,
        image,
        numComparisons,
        elo,
        uniqueCount,
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
      <div ref={scrollTarget}>
        <CompletedComparisons data={data} />
      </div>
    </>
  );
}
