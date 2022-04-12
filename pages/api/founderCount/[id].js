import { db } from "../../../utils/firebase";
import crypto from "crypto";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  async function getFounderCount(req, res) {
    const { id: profileId } = req.query;

    const founderHash = crypto
      .createHash("sha256")
      .update(profileId + process.env.CRYPTO_SALT)
      .digest("base64")
      .split("/")
      .join("!");

    try {
      const countRef = db.collection("Founders").doc(founderHash);
      const countDoc = await countRef.get();
      if (!countDoc.data()) {
        res.status(400).send();
      } else {
        res.status(200).json({ count: countDoc.data().number });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.response || error });
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
