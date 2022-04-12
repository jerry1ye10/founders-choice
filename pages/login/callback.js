import { withIronSessionSsr } from "iron-session/next";
import ky from "ky-universal";

import Loader from "../../components/Loader";
import { getEmail, getProfile } from "../../utils/auth";
import { VERIFY, LOGIN, GET_TOKEN } from "../../utils/routes";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ query, req }) {
    const { code, state } = query;

    if (state !== process.env.NEXT_PUBLIC_LINKEDIN_AUTH_CHECKSUM) {
      console.error("SECURITY ISSUE!");
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    try {
      // Generate and save authToken in session
      const { access_token: authToken = null } = await ky
        .post(`${process.env.NEXT_PUBLIC_BASE_URL}${GET_TOKEN}`, {
          json: { code },
        })
        .json();
      req.session.authToken = authToken;
      await req.session.save();

      // Retrieve profile using authToken
      const emailRes = await getEmail(authToken);
      const profileRes = await getProfile(authToken);
      req.session.profile = {
        first: profileRes.localizedFirstName,
        last: profileRes.localizedLastName,
        id: profileRes.id,
        image:
          profileRes?.profilePicture?.["displayImage~"]?.elements?.[3]
            ?.identifiers?.[0]?.identifier,
        email: emailRes?.elements?.[0]?.["handle~"]?.emailAddress,
      };
      await req.session.save();

      return {
        redirect: {
          destination: VERIFY,
          permanent: true,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        redirect: {
          destination: LOGIN,
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

export default function Callback() {
  return <Loader className="mt-36" />;
}
