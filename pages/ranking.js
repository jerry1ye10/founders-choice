import Link from "next/link";
import { LOGIN } from "../utils/routes";
import ky from "ky-universal";
import { WAITLIST_SIGNUP } from "../utils/routes";
import { Ranking } from "../components/form/ranking";
import { useState } from "react";

export async function getServerSideProps() {
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

export default function CompletedComparisons({ data = [] }) {
  const [email, setEmail] = useState("");

  const SHOW_RANKING = true;

  async function handleSubmit() {
    await ky.post(WAITLIST_SIGNUP, {
      json: {
        email: email,
      },
    });
    location.reload();
  }
  if (SHOW_RANKING) {
    return (
      <div className="p-20">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            flexDirection: "column",
          }}
        >
          <h1 className="montserrat text-left	text-3xl sm:text-6xl font-semibold mb-2 ">
            Latest Rankings ({new Date().toLocaleDateString()})
          </h1>

          <h2 className="raleway text-left text-2xl font-extralight mb-4">
            Learn more about how we generate these rankings{" "}
            <a className="underline" href="/about">
              here.
            </a>
          </h2>
          <Ranking data={data} />
        </div>
      </div>
    );
  }
  return (
    <div class="flex flex-col items-center justify-center text-center sm:mt-24">
      <h2 class="montserrat text-sm sm:text-1xl md:text-2xl font-semibold mt-8 font-bold w-full xs-w-1/2 px-5 sm:px-20 md:px-40">
        We're still collecting the first wave of founder feedback to complete
        our initial VC ranking. Check back soon, or enter your email and we'll
        let you know when these rankings are complete.
      </h2>
      <div class="w-full max-w-sm py-4">
        <div class="flex items-center py-2">
          <input
            class="montserrat w-full mr-3 py-1 px-2 border-2 border-black focus:outline-none"
            type="text"
            placeholder="Enter Email Here"
            aria-label="Email Entry"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div class="flex items-center">
          <button
            onClick={handleSubmit}
            class="montserrat w-full mr-3 py-1 px-2 border-2 border-black"
          >
            {" "}
            Sign Up{" "}
          </button>
        </div>
      </div>
      <h3 class="raleway text-xl font-light mt-8 font-bold w-full xs-w-1/2">
        If you're a venture-backed founder and would like to contribute to our
        rankings, please do so{" "}
        <Link href={LOGIN}>
          <a class="underline text-blue-400">here</a>
        </Link>
      </h3>
    </div>
  );
}
