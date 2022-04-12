import { db, admin } from "../../utils/firebase";

export default async function submitReferrals(req, res) {
  if (req.method !== "POST") {
    res.status(404);
    return;
  }
  try {
    const emails = req.body.emails;
    const signupsRef = db.collection("referrals").doc("referrals");
    await signupsRef.update({
      emails: admin.firestore.FieldValue.arrayUnion(...emails),
    });
    res.status(200).json({});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.response || error });
  }
}
