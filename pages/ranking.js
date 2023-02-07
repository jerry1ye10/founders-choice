import Link from "next/link";
import Image from "next/image";
import { LOGIN } from "../utils/routes";
import ky from "ky-universal";
import { WAITLIST_SIGNUP } from "../utils/routes";
import { Ranking } from "../components/form/ranking";
import { useState } from "react";
import Beta from "../public/logos/beta.png";
import SignalFire from "../public/logos/signalfire.png";
import Crunchbase from "../public/logos/crunchbase.png";
import Precursor from "../public/logos/precursor.png";
import Canvas from "../public/logos/canvas.png";

const SHOW_RANKING = true;
const STYLED_HEADER = `
  montserrat text-5xl font-semibold sm:my-8 mb-2 sm:mb-0 mb-4
`;
export default function CompletedComparisons({ data = [] }) {
  const [email, setEmail] = useState("");

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
      <div className="sm:px-20 p-4 sm:mt-6 mt-2">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            flexDirection: "column",
          }}
        >
          <h1 className="montserrat text-left	text-3xl sm:text-6xl font-semibold mb-2 ">
            Founder's Choice VC Leaderboard
          </h1>

          <h2 className="raleway text-left text-2xl font-extralight mb-4">
            Learn more about how we generate these rankings{" "}
            <a className="underline" href="/about">
              here
            </a>
          </h2>
          <Ranking data={data} />
          <h1
            className={`montserrat text-5xl font-semibold sm:my-8 sm:mb-0 text-center mt-12 lg:mt-16 `}
          >
            Thank you to our supporters
          </h1>
          <div className="px-24 flex items-center justify-center mt-10">
            <Image
              className="cursor-pointer"
              onClick={() =>
                window.open(
                  "https://canvasapp.com/?utm_source=founderschoice&utm_medium=sponsorship",
                  "_self"
                )
              }
              src={Canvas}
              width="500px"
              height="150px"
              layout="fixed"
              alt="Crunchbase"
              objectFit="contain"
            />
          </div>
          <div className="flex items-center justify-center">
            <Image
              className="cursor-pointer"
              onClick={() => window.open("https://signalfire.com/")}
              width="500px"
              height="75px"
              src={SignalFire}
              layout="fixed"
              alt="SignalFire"
              objectFit="contain"
            />
            <Image
              className="cursor-pointer"
              onClick={() =>
                window.open("https://www.crunchbase.com/", "_self")
              }
              src={Crunchbase}
              width="500px"
              height="150px"
              layout="fixed"
              alt="Crunchbase"
              objectFit="contain"
            />
          </div>
          <div className="flex items-center justify-center">
            <Image
              className="cursor-pointer"
              onClick={() => window.open("https://precursorvc.com/", "_self")}
              src={Precursor}
              layout="fixed"
              width="500px"
              height="150px"
              alt="Precursor Ventures"
              objectFit="contain"
            />

            <Image
              className="cursor-pointer"
              onClick={() =>
                window.open("https://www.bloombergbeta.com/", "_self")
              }
              src={Beta}
              width="500px"
              height="150px"
              alt="Bloomberg Beta"
              objectFit="contain"
            />
          </div>
          <h2 className="raleway text-left sm:text-2xl font-extralight mb-4 sm:mt-20 mt-8 text-md">
            We only include firms where we received 100 or more comparisons to
            other firms. If you're a founder and you want to help increase the
            amount of firms on our list, please contribute to our rankings{" "}
            <Link href="/login/">
              <a class="underline text-blue-400">here</a>
            </Link>
            . Our next ranking will be coming out in early February!
          </h2>
          <h2 className="raleway text-left sm:text-2xl font-extralight mb-4 sm:mt-5 text-md">
            Disclaimer: Even though we want our ranking to be as comprehensive
            as possible, we recommend doing your own diligence on VC firms.
            Visit our{" "}
            <Link href="/about/">
              <a class="underline text-blue-400">About</a>
            </Link>{" "}
            page for some recommended resources on doing diligence.
          </h2>

          <h2 className="raleway text-left sm:text-2xl font-extralight mb-4 sm:mt-5 text-md lg:hidden">
            Note: On the desktop version of this site, we show more data on each
            firm, including the number of comparisons they received and elo
            score.
          </h2>
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
      <h3 class="raleway text-xl font-light mt-8 w-full xs-w-1/2">
        If you're a venture-backed founder and would like to contribute to our
        rankings, please do so{" "}
        <Link href={LOGIN}>
          <a class="underline text-blue-400">here</a>
        </Link>
      </h3>
    </div>
  );
}
