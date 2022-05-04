import Link from "next/link";
import { useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import ky from "ky-universal";
import { AiFillPlusCircle } from "react-icons/ai";

import { GET_FOUNDER_COUNT, SUBMIT_REFERRALS } from "../../utils/routes";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    try {
      const data = await ky
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}${GET_FOUNDER_COUNT}${
            "/" + req.session.profile.id
          }`
        )
        .json();

      return {
        props: {
          count: data.count,
        },
      };
    } catch (e) {
      console.error(e);
      return {
        props: {
          count: 0,
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

export default function CompletedComparisons(props) {
  const [countNumber, setCount] = useState(0);
  const [emails, setEmails] = useState([""]);
  const [didRefer, setDidRefer] = useState(false);
  useEffect(async () => {
    setCount(props.count);
  }, []);

  function addEmail() {
    const clone = emails.slice(0);
    clone.push("");
    setEmails(clone);
  }

  function ordinal_suffix_of(i) {
    const j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return i + "st";
    }
    if (j == 2 && k != 12) {
      return i + "nd";
    }
    if (j == 3 && k != 13) {
      return i + "rd";
    }
    return i + "th";
  }

  function submitReferrals() {
    if (emails.every(email => !email)) return;
    ky.post(`${process.env.NEXT_PUBLIC_BASE_URL}${SUBMIT_REFERRALS}`, {
      json: { emails },
    });
    setDidRefer(true);
  }

  if (didRefer) {
    return (
      <div className="flex flex-col items-center justify-center text-center mt-24">
        <h1 className="montserrat text-4xl font-semibold mt-8 font-bold w-full xs-w-1/2">
          Thank you so much for taking the time to pass our site onto a few
          friends! We'll send you an update when our rankings are live.
        </h1>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center mt-24">
        <h1 className="montserrat text-5xl font-semibold mt-8 lg:px-10 font-bold w-full xs-w-1/2">
          Congratulations! You're the {ordinal_suffix_of(countNumber)} founder
          to complete your rankings!
        </h1>
      </div>
      <div className="mx-30 flex justify-center mt-5">
        <div className="w-1/2 overflow-hidden h-4 text-xs flex rounded bg-purple-200">
          <div
            style={{ width: (countNumber / 2.0).toFixed(2) + "%" }}
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
      <div className="mx-30 flex justify-center">
        <div className="w-1/2">
          <h2 className="grid justify-items-end font-bold">
            {countNumber}/200
          </h2>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-center mx-24">
        <h2 className="raleway text-xl font-light mt-2 font-bold lg:px-20 w-full xs:w-1/2">
          Once we've collected data from 200 founders, we'll work to start
          publishing our ranking list. If you'd like to help us, please share
          this with your friends. Enter other founders you know below, and we'll
          reach out to them!
        </h2>
        {emails.map(function (email, index) {
          return (
            <div class="w-full max-w-sm pt-4">
              <div class="flex items-center py-2 ">
                <input
                  class="montserrat w-64 mr-3 py-1 px-2 border border-black focus:outline-none flex-1"
                  type="text"
                  placeholder="Enter Email Here"
                  aria-label="Email Entry"
                  value={emails[index]}
                  onChange={(e) => {
                    const clone = emails.slice(0);
                    clone[index] = e.target.value;
                    setEmails(clone);
                  }}
                />
                <div class="flex w-8">
                  {index === emails.length - 1 && (
                    <button style={{ fontSize: "30px" }} onClick={addEmail}>
                      <AiFillPlusCircle />{" "}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <button
          className="bg-transparent hover:bg-gray-400 text-3xl border border-black py-2 px-4 rounded-full w-60 my-4"
          onClick={submitReferrals}
        >
          Enter Emails
        </button>
      </div>
    </>
  );
}
