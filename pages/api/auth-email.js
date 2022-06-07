import { withIronSessionApiRoute } from "iron-session/next";
import { db } from "../../utils/firebase";

// TODO: Remove this when possible. It is depreciated.
export default withIronSessionApiRoute(
  async function submitInvestors(req, res) {
    if (req.method !== "POST") {
      res.status(404);
      return;
    }

    console.log("DING DING DING")

    const profileId = req.body.token;

    const validateRef = db.collection("MTurk").doc(profileId);
    const validateDoc = await validateRef.get();

    if (!validateDoc) {
      res.status(404).send({});
      return;
    }

    req.session.profile = {
      id: profileId,
    };
    await req.session.save();

    const validateDocData = validateDoc.data();

    res.status(200).json({
      name: validateDocData?.name,
      company: validateDocData?.company,
      crunchbaseSlug: validateDocData?.crunchbaseSlug,
      additionalInvestors: validateDocData?.additionalInvestors,
    });
  },
  {
    cookieName: "vcrank_session",
    password: process.env.SESSION_SECRET_KEY,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
