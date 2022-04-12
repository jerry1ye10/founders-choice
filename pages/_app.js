import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import { AppWrapper } from "../context/state";
import Navbar from "../components/Navbar";

function App({ Component, pageProps }) {
  return (
    <AppWrapper>
      <Navbar />
      <Component {...pageProps} />
    </AppWrapper>
  );
}

export default App;
