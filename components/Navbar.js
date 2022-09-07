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
              Founders: Rank VCs
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
