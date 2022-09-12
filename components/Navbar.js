import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const isIndex = router.pathname === `/`;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
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
