import { db } from "../../utils/firebase";

export default async function signupEmail(req, res) {
  if (req.method == "OPTIONS") {
    //res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }

  if (req.method !== "POST") {
    res.status(404);
    return;
  }
  try {
    const email = req.body.email;
    const signupsRef = db.collection("signups").doc(email);
    await signupsRef.set({
      email: email,
    });
    res.status(200).json({});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.response || error });
  }
}
