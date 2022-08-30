import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default (displayBanner = false) => {
  const router = useRouter();
  const isIndex = router.pathname === `/`;
  const isRanking = router.pathname === "/ranking";
  const isAbout = router.pathname === "/about";
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {displayBanner && (
        <div class="bg-gray-300">
          <div class="max-w-7xl mx-auto py-6 px-3 sm:px-6 lg:px-8 text-center">
            <p class="font-medium text-2xl">
              {" "}
              We're excited to announce the release of our first founder's
              choice rankings!
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
              href="/login/"
              className="raleway text-3xl font-light ml-auto mr-6"
            >
              Contribute
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
