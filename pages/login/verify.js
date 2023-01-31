import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import crypto from "crypto";
import { withIronSessionSsr } from "iron-session/next";
import ky from "ky-universal";
import AsyncSelect from "react-select/async";
import Loader from "../../components/Loader";
import CompanyModal from "../../components/CompanyModal";
/**
  Do redirects here
  They either...
  A) have comparisons
  B) Are done with comparisons
  D) havent confirmed their investors
  E) Haven't selected their company yet
**/

import {
  LOGIN,
  GET_COMPANY,
  VERIFY_USER,
  FORM,
  COMPLETED_COMPARISONS,
  COMPARISONS,
  ADD_ADDITIONAL_FOUNDERS,
} from "../../utils/routes";
import "tailwindcss/tailwind.css";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const { first, last, id, email } = req.session.profile;
    const { db } = require("../../utils/firebase");

    // If we find an existing validation request, we redirect
    const docRef = db.collection("MTurk").doc(id);
    const validationReq = (await docRef.get()).data();

    const founderHash = crypto
      .createHash("sha256")
      .update(id + process.env.CRYPTO_SALT)
      .digest("base64")
      .split("/")
      .join("!");

    const founderRef = db.collection("Founders").doc(founderHash);
    const founderDoc = (await founderRef.get()).data();

    if (!req.session?.authToken) {
      return {
        redirect: {
          destination: LOGIN,
          permanent: false,
        },
      };
    }

    if (founderDoc?.comparisons && founderDoc.comparisons.length === 0) {
      return {
        redirect: {
          destination: COMPLETED_COMPARISONS,
          permanent: false,
        },
      };
    }
    if (founderDoc) {
      return {
        redirect: {
          destination: COMPARISONS,
          permanent: false,
        },
      };
    }

    // NOTE: Change this to change whether people can immediately begin comparing
    if (validationReq) {
      return {
        redirect: {
          destination: `${FORM}/${id}`,
          permanent: false,
        },
      };
    }

    if (first && last) {
      // TODO: Create ky instance with NEXT_PUBLIC_BASE_URL as prefixUrl
      const res = await ky
        .post(`${process.env.NEXT_PUBLIC_BASE_URL}${GET_COMPANY}`, {
          json: { first, last },
        })
        .json();

      const companyOptions = res.options;
      if (!companyOptions) {
        companyOptions = [];
      }

      return {
        props: {
          companyOptions,
          profile: req.session?.profile,
        },
      };
    }
    return { props: {} };
  },
  {
    cookieName: "vcrank_session",
    password: process.env.SESSION_SECRET_KEY,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);

export function VerificationInfo({ profile }) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="raleway text-2xl font-extralight mt-8 font-bold w-full xs-w-1/2">
        Sit tight while we verify your identity! Expect an email{" "}
        {profile && "at " + profile?.email} in 1-3 days when we're ready for
        you.
      </h1>
      <h2 className="raleway text-xl font-extralight mt-8 px-24 font-bold w-full xs-w-1/2">
        In the meanwhile, if you know other venture-backed founders who might
        want to serve the startup community by ranking their investors, please
        share{" "}
        <a className="underline text-blue-400" href="/">
          our site
        </a>{" "}
        with them!
      </h2>
    </div>
  );
}

export default function SelectCompany({ companyOptions, profile }) {
  const [selectedCompany, setSelectedCompany] = useState(companyOptions?.[0]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const router = useRouter();

  const handleNewCompanySubmit = async () => {
    await ky.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${ADD_ADDITIONAL_FOUNDERS}`,
      {
        json: {
          additionalFounders: {
            ...profile,
            slug: selectedCompany.value,
            companyName: selectedCompany.label,
          },
        },
      }
    );
    await handleSubmit();
  };
  const handleSubmit = async () => {
    await ky.post(`${process.env.NEXT_PUBLIC_BASE_URL}/${VERIFY_USER}`, {
      json: {
        ...profile,
        crunchbaseSlug: selectedCompany.value,
        company: selectedCompany.label,
      },
    });
    setHasSubmitted(true);
  };

  useEffect(() => {
    if (hasSubmitted) {
      router.push(`${FORM}/${profile?.id}`);
    }
  }, [hasSubmitted]);

  if (hasSubmitted) {
    return (
      <Loader className="mt-36">
        <h1 className="mt-6">Please wait while we confirm your company...</h1>
      </Loader>
    );
  } else if (companyOptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="raleway text-2xl font-extralight mt-8 font-bold w-full xs-w-1/2 px-5">
          We're missing a record of a venture-backed startup that you founded.
          If this is a mistake, please reach out to Jerry Ye at
          jerry1ye10@gmail.com
        </h1>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="raleway text-2xl font-extralight mt-8 font-bold w-full xs-w-1/2 px-5">
          Please confirm the startup you'd like to rank investors for.
        </h1>
        <AsyncSelect
          className="w-1/2"
          defaultValue={companyOptions?.[0]}
          defaultOptions={companyOptions}
          onChange={(newValue) => setSelectedCompany(newValue)}
        />
        <button
          onClick={handleSubmit}
          className="bg-transparent hover:bg-gray-400 text-3xl border border-black py-2 px-4 rounded-full w-80 my-4"
        >
          Next
        </button>{" "}
        <h3 className="raleway text-xl font-light mt-8 w-full md:px-48 sm:px-24 xs-w-1/2">
          If the startup you founded is missing or incorrect, please manually
          add it{" "}
          <label
            htmlFor="my-modal"
            className="cursor-pointer underline hover:font-bold"
          >
            here
          </label>
        </h3>
        <CompanyModal
          setSelectedCompany={setSelectedCompany}
          handleSubmit={handleNewCompanySubmit}
          oldCompany={companyOptions?.[0]}
        />
      </div>
    );
  }
}
