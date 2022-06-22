import _ from "lodash";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import ky from "ky-universal";
import "tailwindcss/tailwind.css";

import {
  GET_COMPARISONS,
  SUBMIT_COMPARISONS,
  COMPLETED_COMPARISONS,
  LOGIN,
} from "../../utils/routes";
import Loader from "../../components/Loader";
import { useAppContext } from "../../context/state";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    if (!req.session.authToken) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return {
      props: {
        profile: req.session.profile,
        authToken: req.session.authToken,
      },
    };
  },
  {
    cookieName: "vcrank_session",
    password: process.env.SESSION_SECRET_KEY,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);

function ContinueScreen({ percentage, continueComparisons }) {
  const percent = Math.round(percentage);
  const [value, setValue] = useState(0);
  useEffect(async () => {
    await setTimeout(function () {
      if (value === percent) {
        return;
      }
      setValue(value + 1);
    }, 8);
  }, [value]);

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center mt-24">
        <h2 className="montserrat text-3xl font-semibold mt-8 font-bold w-full xs-w-1/2 px-40">
          Thanks for getting through a batch of comparisons! Your work helps
          other founders make better investor decisions.
        </h2>
      </div>

      <div className="mx-30 flex justify-center">
        <div className="w-1/2 overflow-hidden h-4 text-xs flex rounded bg-purple-200">
          <div
            style={{ width: value + "%" }}
            className="
              shadow-none
              flex flex-col
              text-center
              whitespace-nowrap
              text-white
              justify-center
              bg-purple-500
            "
          ></div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-center mt-24">
        <button
          onClick={continueComparisons}
          className="bg-transparent hover:bg-gray-400 text-3xl border border-black py-2 px-4 rounded-full w-60 my-4"
        >
          Continue
        </button>
      </div>
    </>
  );
}

export default function Feedback() {
  const [comparisons, setComparisons] = useState([]);
  const [totalComparisons, setTotalComparisons] = useState([]);
  const [currentComparison, setCurrentComparison] = useState(0);
  const [promptContinue, setPromptContinue] = useState(false);
  const [firstComparison, setFirstComparison] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { investors, setInvestors } = useAppContext();
  const router = useRouter();

  function generateComparisonObjects(comparisons, investors) {
    const enrichedComparisons = [];
    for (let i = 0; i < comparisons.length; i++) {
      enrichedComparisons.push({
        vc1: investors.find((investor) => investor.name === comparisons[i].vc1),
        vc2: investors.find((investor) => investor.name === comparisons[i].vc2),
        result: null,
      });
    }
    setComparisons(enrichedComparisons);
  }

  useEffect(async () => {
    try {
      const data = await ky
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}${GET_COMPARISONS}`)
        .json();
      const { comparisons, investors } = data;
      generateComparisonObjects(comparisons, investors);
      setInvestors(investors);
      if (comparisons.length === 0) {
        router.push(COMPLETED_COMPARISONS);
      }
    } catch (e) {
      console.error(e);
      router.push(LOGIN);
    }
  }, []);

  useEffect(() => {
    if (currentComparison === comparisons.length && comparisons.length !== 0) {
      router.push(COMPLETED_COMPARISONS);
    }
  }, [currentComparison]);

  const comparison = comparisons[currentComparison];
  const vc1Selected = comparison?.result === comparison?.vc1?.slug;
  const vc2Selected = comparison?.result === comparison?.vc2?.slug;
  const tieSelected = comparison?.result === "";

  async function handleSubmit(e) {
    await ky
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}${SUBMIT_COMPARISONS}`, {
        json: { comparison: comparisons[currentComparison] },
      })
      .json();
    if (currentComparison + 1 === comparisons.length) {
      router.push(COMPLETED_COMPARISONS);
    }
  }

  function setVC(vcName) {
    const newComparisons = [...comparisons];
    newComparisons[currentComparison].result = vcName;
    setComparisons(newComparisons);
  }

  function submitComparison(vcName) {
    setFirstComparison(false);
    setVC(vcName);
    getNextComparison();
  }

  const getNextComparison = () => {
    handleSubmit();
    if (currentComparison < comparisons.length) {
      setCurrentComparison(currentComparison + 1);
    }
  };

  const continueComparisons = () => {
    setPromptContinue(false);
  };

  if (isLoading) {
    return (
      <Loader className="mt-36">
        <h1 className="mt-6">Please wait while we submit your feedback...</h1>
      </Loader>
    );
  }

  if (promptContinue) {
    const progressPercentage =
      100 -
      (totalComparisons.length /
        ((investors.length * (investors.length - 1)) / 2)) *
        100;

    return (
      <ContinueScreen
        percentage={progressPercentage}
        continueComparisons={continueComparisons}
      />
    );
  }

  if (!comparison) {
    return <Loader className="mt-36"></Loader>;
  }

  return (
    <div>
      <div className="mx-30 flex justify-center">
        <div className="w-1/2 overflow-hidden h-4 text-xs flex rounded bg-purple-200">
          <div
            style={{
              width:
                Math.round(
                  100 -
                    ((comparisons.length - currentComparison) /
                      ((investors.length * (investors.length - 1)) / 2)) *
                      100
                ) + "%",
            }}
            className="
              shadow-none
              flex flex-col
              text-center
              whitespace-nowrap
              text-white
              justify-center
              bg-purple-500
            "
          ></div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center text-center">
        <h2 className="raleway text-4xl font-extralight my-2 font-bold">
          Who would you rather have as an investor?
        </h2>

        <div className="flex flex-wrap justify-evenly py-2 justify-center w-1/2">
          <button
            className={`flex font-bold p-12 rounded hover:bg-gray-300 h-100 items-start flex-col	${
              vc1Selected && "bg-gray-300"
            }`}
            onClick={() => {
              submitComparison(comparison?.vc1?.slug);
            }}
          >
            <div className="w-64 h-64 bg-white overflow-hidden flex">
              <img
                className="object-contain w-full"
                src={comparison?.vc1?.image}
              />
            </div>
            <h1 className="raleway font-bold text-3xl break-words w-64 mt-2">
              {comparison?.vc1?.name}
            </h1>
          </button>
          <button
            className={`flex font-bold p-12 rounded hover:bg-gray-300 h-100 items-start flex-col	${
              vc2Selected && "bg-gray-300"
            }`}
            onClick={() => {
              submitComparison(comparison?.vc2?.slug);
            }}
          >
            <div className="w-64 h-64 bg-white overflow-hidden flex">
              <img
                className="object-contain w-full"
                src={comparison?.vc2?.image}
              />
            </div>
            <h1 className="raleway font-bold text-3xl break-words w-64 mt-2">
              {comparison?.vc2?.name}
            </h1>
          </button>
        </div>
        <div className="flex flex-wrap justify-evenly py-2 justify-center py-10">
          <button
            className={`flex items-center p-4 rounded-full bg-gray-200 hover:bg-gray-400 md:mr-24${
              tieSelected && "bg-gray-400"
            }`}
            onClick={() => {
              submitComparison("");
            }}
          >
            <h1 className="raleway font-bold text-2xl md:ml-42">
              I have equal/no preference.
            </h1>
          </button>
          {firstComparison && (
            <h2 class="montserrat text-sm sm:text-1xl md:text-2xl font-semibold mt-8 font-bold w-full xs-w-1/2 px-5 sm:px-20 md:px-40">
              We'll keep showing you possible pairings, you can stop anytime.
              Once you click a choice, you won't be able to change your choice
              for a few months.
            </h2>
          )}
        </div>
      </div>
    </div>
  );
}
