import ky from "ky-universal";

import { LINKEDIN_AUTH_GET_TOKEN } from "../../utils/auth";
import { LOGIN_CALLBACK } from "../../utils/routes";

// Proxy route to LinkedIn's backend auth route
export default async function loginAPI(req, res) {
  if (req.method !== "POST") {
    res.status(404);
    return;
  }

  try {
    const authFormData = new URLSearchParams({
      grant_type: `authorization_code`,
      code: req.body.code,
      client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}${LOGIN_CALLBACK}`,
    });
    const authRes = await ky
      .post(LINKEDIN_AUTH_GET_TOKEN, { body: authFormData })
      .json();
    return res.status(200).json(authRes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.response || error });
  }
}
