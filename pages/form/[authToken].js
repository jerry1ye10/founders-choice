import { useState } from "react";
import { useRouter } from "next/router";
import ky from "ky-universal";
import { withIronSessionSsr } from "iron-session/next";

import InvestorModal from "../../components/InvestorModal";

import {
  GET_INVESTORS,
  COMPARISONS,
  AUTH_EMAIL,
  CONFIRM_INVESTORS,
} from "../../utils/routes";
import { useAppContext } from "../../context/state";

// Test uuid: 3dfd8d9c-7480-79e8-a983-dcf1d0f8e1a5 (Twitch)

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, query }) {
    const { authToken } = query;
    const { db } = require("../../utils/firebase");

    // TODO: Create ky instance with NEXT_PUBLIC_BASE_URL as prefixUrl
    try {
      const res = await ky
        .post(`${process.env.NEXT_PUBLIC_BASE_URL}${AUTH_EMAIL}`, {
          json: { token: authToken },
          timeout: false,
        })
        .json();

      // TODO: if json returns that it's not an auth token return to "/"
      if (!res?.name) {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
      const data = await ky
        .post(`${process.env.NEXT_PUBLIC_BASE_URL}${GET_INVESTORS}`, {
          json: {
            company: res?.crunchbaseSlug,
            additionalInvestors: res?.additionalInvestors,
          },
          timeout: false,
        })
        .json();
      if (!req.session.profile) {
        req.session.authToken = authToken;
        const validateRef = db.collection("MTurk").doc(authToken);
        const validateDoc = await validateRef.get();
        req.session.profile = {
          id: authToken,
          first: validateDoc.data().name.split(" ")[0],
          last: validateDoc.data().name.split(" ")[1],
          email: validateDoc.data().email,
        };
        await req.session.save();
      }
      return {
        props: {
          investors: data?.investors,
          name: res?.name,
          company: res?.company,
        },
      };
    } catch (e) {
      console.error(e);
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  },
  {
    cookieName: "vcrank_session",
    password: process.env.SESSION_SECRET_KEY,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);

export default function ConfirmInvestors({ investors = [], name, company }) {
  const router = useRouter();

  const [currentInvestors, setCurrentInvestors] = useState(investors);
  const { setInvestors } = useAppContext();

  const submitInvestors = async () => {
    await ky.post(`${process.env.NEXT_PUBLIC_BASE_URL}${CONFIRM_INVESTORS}`);
    setInvestors(investors);
    router.push(COMPARISONS);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="raleway text-1xl sm:text-2xl font-extralight sm:mt-8 font-bold w-full px-10 md:w-3/4 xs-w-1/2">
        Hi there {name}!
        <br />
        Please confirm that these are all the venture capital firms who invested
        in {company || "your company"}.
      </h1>
      <div className="bg-gray-300 h-96 w-2/3 overflow-scroll rounded-lg">
        {currentInvestors
          .sort(function (a, b) {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          })
          .map((i) => (
            <div class="flex items-center p-4">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white rounded-lg overflow-hidden flex items-center">
                <img className="object-contain w-full my-auto" src={i?.image} />
              </div>
              <h1 className="raleway font-bold text-xs sm:text-1xl md:text-3xl ml-4 sm:ml-8">
                {i?.name}
              </h1>
            </div>
          ))}
      </div>

      <h3 className="raleway text-lg sm:text-xl font-light w-full mt-4">
        If there are any investors missing, please manually add it{" "}
        <label
          htmlFor="my-modal"
          className="cursor-pointer underline hover:font-bold"
        >
          here
        </label>
      </h3>
      <button
        onClick={submitInvestors}
        className="bg-transparent hover:bg-gray-400 md:text-3xl border border-black py-2 px-4 rounded-full w-60 sm:w-80 mt-4"
      >
        Confirm Investors
      </button>

      <InvestorModal
        currentInvestors={currentInvestors}
        setCurrentInvestors={setCurrentInvestors}
      />
    </div>
  );
}
