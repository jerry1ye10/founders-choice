import ky from "ky-universal";
import { LOGIN_CALLBACK } from "../utils/routes";

export const LINKEDIN_AUTH_URL = () =>
  `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}${LOGIN_CALLBACK}&state=${process.env.NEXT_PUBLIC_LINKEDIN_AUTH_CHECKSUM}&scope=r_liteprofile%20r_emailaddress`;
export const LINKEDIN_AUTH_GET_TOKEN = `https://www.linkedin.com/oauth/v2/accessToken`;
const LINKEDIN_EMAIL_URL = `https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))`;
const LINKEDIN_PROFILE_URL = `https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))`;

export async function getEmail(access_token) {
  const authedClient = ky.create({
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const res = await authedClient.get(LINKEDIN_EMAIL_URL).json();
  return res;
}

export async function getProfile(access_token) {
  const authedClient = ky.create({
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const res = await authedClient.get(LINKEDIN_PROFILE_URL).json();
  return res;
}
