import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Countdown from "react-countdown";

export default function Navbar() {
  const router = useRouter();
  const isIndex = router.pathname === `/`;
  const [isMobile, setIsMobile] = useState(false);
  const [countdown, setCountDown] = useState(0);

  function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (seconds < 10) {
      return (
        <span>
          {hours}:{minutes}:0{seconds}
        </span>
      );
    }
    // Render a countdown
    return (
      <span>
        {hours}:{minutes}:{seconds}
      </span>
    );
  };

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    const current = new Date();
    const deadline = new Date("2023-02-07T00:00:00Z");
    const difference = dateDiffInDays(current, deadline);
    setCountDown(difference);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const deadline = new Date("2022-09-10 UTC-4");

  return (
    <>
      {isIndex && (
        <div class="bg-gray-300">
          <div class="max-w-7xl mx-auto py-5 px-3 sm:px-6 lg:px-8 text-center">
            <p class="font-medium text-2xl">
              {" "}
              We're releasing our second ranking list tomorrow. Get your rankings in
              now!
            </p>
          </div>
        </div>
      )}
      <nav className="flex top-0 inline-block w-screen p-6">
        {isIndex || (
          <a href="/" className="raleway sm:text-4xl text-xl font-bold mr-6">
            Founder's Choice
          </a>
        )}
        {(!isIndex && isMobile) || (
          <>
            <a
              href="/login/"
              className="raleway text-3xl font-light ml-auto mr-6"
            >
              Rank your VCs
            </a>
            <a href="/about" className="raleway font-light text-3xl mr-6">
              About
            </a>
          </>
        )}
      </nav>
    </>
  );
}
