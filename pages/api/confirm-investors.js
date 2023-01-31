import { withIronSessionApiRoute } from "iron-session/next";
import crypto from "crypto";
import { shuffle } from "lodash";

import { admin, db } from "../../utils/firebase";
import { getInvestors } from "../../utils/crunchbase";

//request needs profile.id
export default withIronSessionApiRoute(
  async function submitInvestors(req, res) {
    if (req.method !== "POST") {
      res.status(404);
      return;
    }

    const profileId = req.session.profile.id;
    const UNALLOWED_INVESTOR_TYPES = ["angel"];

    const response = await db.runTransaction(async (t) => {
      // Transactions require all reads be done before writes
      const validateRef = db.collection("MTurk").doc(profileId);
      const validateDoc = await t.get(validateRef);
      console.log(validateDoc.data());
      const companyCode = validateDoc.data()?.crunchbaseSlug;
      const founderHash = crypto
        .createHash("sha256")
        .update(profileId + process.env.CRYPTO_SALT)
        .digest("base64")
        .split("/")
        .join("!");
      const founderRef = db.collection("Founders").doc(founderHash);
      const founderDoc = await t.get(founderRef);
      if (founderDoc.data()) return res.status(500);
      const countRef = db.collection("founderCount").doc("count");
      const countDoc = await countRef.get();
      const founderNumber = countDoc.data().count;

      //Get Investors below -> do comparisons -> create user object
      try {
        const investorRes = await getInvestors(companyCode);
        const investors = investorRes.filter((investor) => {
          let retVal = true;
          if (investor.investor_type === undefined) {
            return false;
          } else {
            UNALLOWED_INVESTOR_TYPES.forEach((type) => {
              if (investor.investor_type.includes(type)) {
                retVal = false;
              }
            });
            return retVal;
          }
        });
        let investorsObjs = investors.map((i) => ({
          image: i?.image_url || "",
          name: i?.identifier?.value,
          id: i?.identifier?.uuid,
          slug: i?.identifier?.permalink,
        }));
        console.log(validateDoc.data().additionalInvestors);
        if (validateDoc.data().additionalInvestors) {
          investorsObjs = investorsObjs.concat(
            validateDoc.data().additionalInvestors
          );
        }

        let investorNames = [];
        investorsObjs.forEach((i) => {
          investorNames.push(i.name);
        });
        let comparisons = [];
        for (let i = 0; i < investorNames.length; i++) {
          for (let j = 0; j < i; j++) {
            comparisons.push({
              vc1: investorNames[i],
              vc2: investorNames[j],
            });
          }
        }
        comparisons = shuffle(comparisons);
        t.set(founderRef, {
          //Don't want to store any identity alongside it; if we want we can also hash the profile id when storing this later
          comparisonTime: [],
          investors: investorsObjs,
          comparisons: comparisons,
          outcomes: [],
          number: founderNumber,
        });
        t.update(countRef, { count: admin.firestore.FieldValue.increment(1) });
        return res.status(200).json({});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.response || error });
      }
    });
    return res.end();
  },
  {
    cookieName: "vcrank_session",
    password: process.env.SESSION_SECRET_KEY,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
