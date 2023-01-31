import { withIronSessionApiRoute } from "iron-session/next";

import { db, admin } from "../../utils/firebase";
//request needs profile.id
export default withIronSessionApiRoute(
  async function submitInvestors(req, res) {
    if (req.method !== "POST") {
      return res.status(400).json({});
    }
    if (
      !req.body.additionalInvestors ||
      req.body.additionalInvestors.length === 0
    ) {
      return res.status(400).json({});
    }
    const profileId = req.session.profile.id;
    try {
      await db.runTransaction(async (t) => {
        // Transactions require all reads be done before writes
        const validateRef = db.collection("MTurk").doc(profileId);
        const validateDoc = await t.get(validateRef);
        const companyCode = validateDoc.data()?.crunchbaseSlug;

        const additionalInvestorsRef = db
          .collection("AdditionalInvestors")
          .doc(companyCode);
        const doc = await additionalInvestorsRef.get();
        if (doc.exists) {
          await additionalInvestorsRef.update({
            investors: req.body.additionalInvestors,
          });
        } else {
          await additionalInvestorsRef.create({
            investors: req.body.additionalInvestors,
          });
        }
      });
      res.status(200).json({});
      return;
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.response || error });
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
