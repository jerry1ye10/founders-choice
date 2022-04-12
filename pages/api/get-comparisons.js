import crypto from "crypto";
import { withIronSessionApiRoute } from "iron-session/next";

import { db } from "../../utils/firebase";

export default withIronSessionApiRoute(
  async function handler(req, res) {
    if (!req.session) return res.status(401);
    if (req.method !== "GET") {
      res.status(404);
      return;
    }
    if (!req.session.authToken) return res.status(401);
    const profileId = req.session.profile.id;

    const founderHash = crypto
      .createHash("sha256")
      .update(profileId + process.env.CRYPTO_SALT)
      .digest("base64")
      .split("/")
      .join("!");
    const founderRef = db.collection("Founders").doc(founderHash);
    const founderDoc = await founderRef.get();
    if (!founderDoc.data()) {
      res.status(500).send();
      return;
    }
    res.status(200).json(founderDoc.data());
  },
  {
    cookieName: "vcrank_session",
    password: process.env.SESSION_SECRET_KEY,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
