import { withIronSessionApiRoute } from "iron-session/next";

import { db } from "../../utils/firebase";
//request needs profile.id
export default withIronSessionApiRoute(
  async function submitInvestors(req, res) {
    const profileId = req.session.profile.id;
    if (req.method !== "POST" || !req.body.additionalFounders || !profileId) {
      return res.status(400).json({});
    } else {
      const founderData = req.body.additionalFounders;
      console.log(founderData);
      try {
        await db.runTransaction(async (t) => {
          const additionalFoundersRef = db
            .collection("AdditionalFounders")
            .doc(`${founderData.first} ${founderData.last}`);
          const doc = await additionalFoundersRef.get();
          if (doc.exists) {
            await additionalFoundersRef.update({
              companyName: founderData.companyName,
              slug: founderData.slug,
            });
          } else {
            await additionalFoundersRef.create({
              companyName: founderData.companyName,
              slug: founderData.slug,
            });
          }
        });
        return res.status(200).json({});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.response || error });
      }
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
