import crypto from "crypto";
import { withIronSessionApiRoute } from "iron-session/next";
import { db, admin } from "../../utils/firebase";

export default withIronSessionApiRoute(
  async function handler(req, res) {
    if (!req.session) return res.status(401);
    if (req.method !== "POST") {
      res.status(404);
      return;
    }
    const profileId = req.session.profile.id;
    if (!req.session.authToken) return res.status(401);
    const founderHash = crypto
      .createHash("sha256")
      .update(profileId + process.env.CRYPTO_SALT)
      .digest("base64")
      .split("/")
      .join("!");

    await db.runTransaction(async t => {
      const founderRef = db.collection("Founders").doc(founderHash);
      const doc = await t.get(founderRef);
      
      //Jerry TODO: change comparison time check to after
      const dates = doc.data().comparisonTime;
      if (dates.length !== 0) {
        res.status(400).send({
          error: "Founder has already submitted comparisons in the past 6 months",
        });
        return;
      }

      const comparison = req.body?.comparison;
      const result = comparison?.result;
      const hasComparison =
        doc.data().comparisons.filter((c) => c.vc1 === comparison.vc1.name && c.vc2 === comparison.vc2.name).length > 0;
      if (!hasComparison) {
        res.status(400).send({}); //TODO: Change res
        return;
      }

      let winnerHash;
      if (result === comparison.vc1.slug) {
        winnerHash = comparison.vc1.name + comparison.vc2.name
      } else if (result === comparison.vc2.slug) {
        winnerHash = comparison.vc2.name + comparison.vc1.name
      } else {
        winnerHash = "---";
      }
      winnerHash = crypto
        .createHash("sha256")
        .update(winnerHash + process.env.INVESTOR_SALT)
        .digest("base64")
        .split("/")
        .join("!")

      t.update(founderRef, {
        comparisons: admin.firestore.FieldValue.arrayRemove({
          vc1: comparison.vc1.name,
          vc2: comparison.vc2.name
        }),
        outcomes: admin.firestore.FieldValue.arrayUnion({
          vc1: comparison.vc1.name,
          vc2: comparison.vc2.name,
          winner: winnerHash
        })
      })
    })

    // This has to run after the above transaction completes. TODO: remove this or somehow deserialize
    await db.runTransaction(async t => {
      const founderRef = db.collection("Founders").doc(founderHash);
      const doc = await t.get(founderRef);
      if (doc.data().comparisons === 0) {
        t.update(founderRef, {
          comparisonTime: admin.firestore.FieldValue.arrayUnion(
            admin.firestore.Timestamp.fromDate(new Date())
          ),
        });
      }
    })

    res.status(200).send({}); //TODO: Make res more descriptive
  },
  {
    cookieName: "vcrank_session",
    password: process.env.SESSION_SECRET_KEY,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
