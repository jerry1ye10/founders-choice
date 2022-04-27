import { useEffect } from "react";
import { useRouter } from "next/router" 
import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import { AppWrapper } from "../context/state";
import Navbar from "../components/Navbar";

function App({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = router_path => {
      window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
        page_path: router_path,
      })
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <AppWrapper>
      <Navbar />
      <Component {...pageProps} />
    </AppWrapper>
  );
}

export default App;
