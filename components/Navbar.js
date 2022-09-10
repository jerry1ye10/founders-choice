import Link from 'next/link'
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Countdown from "react-countdown";

export default (displayBanner = false) => {
  const router = useRouter();
  const isIndex = router.pathname === `/`;
  const isRanking = router.pathname === "/ranking";
  const isAbout = router.pathname === "/about";
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
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    const current = new Date();
    const deadline = new Date("2022-09-10");
    const difference = dateDiffInDays(current, deadline);
    setCountDown(difference);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const deadline = new Date("2022-09-10 UTC-4");

  return (
    <>
      {isIndex && (
        <div class="bg-gray-300">
          <div class="max-w-7xl mx-auto py-6 px-3 sm:px-6 lg:px-8 text-center">
            <p class="font-medium text-2xl">
              {" "}
              We're releasing our first ranking list soon! Sign up to be notified when they go live
              {" "}
              <Link href="/ranking">
                <a className="underline">here</a>
              </Link>.
            </p>
          </div>
        </div>
      )}

      <nav className="flex top-0 inline-block w-screen p-6">
        {isIndex || (
          <a href="/" className="raleway text-4xl font-bold mr-6">
            Founder's Choice
          </a>
        )}
        {(!isIndex && isMobile) || (
          <>
            <a
              href="/ranking"
              className="raleway text-3xl font-light ml-auto mr-6"
            >
              Ranking
            </a>
            <a href="/about" className="raleway font-light text-3xl mr-6">
              About
            </a>
          </>
        )}
      </nav>
    </>
  );
};
