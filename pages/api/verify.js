import { createHITs } from "../../utils/mturk";
import { db } from "../../utils/firebase";
import { HIT } from "@aws-sdk/client-mturk";

export default async function handleVerifySubmit(req, res) {
  if (req.method !== "POST") {
    res.status(404);
    return;
  }

  //TODO: Optimistically create the profile object here
  const {
    first,
    last,
    id: linkedInId,
    image,
    email,
    crunchbaseSlug,
    company,
  } = req.body;
  try {
    const responses = await createHITs([
      {
        linkedInName: `${first} ${last}`,
        linkedInImg: image,
        linkedInSlug: linkedInId,
        crunchbaseName: company,
        crunchbaseSlug: crunchbaseSlug,
      },
    ]);
    const HITCreated = responses?.[0]?.status === `fulfilled`;
    if (!HITCreated) {
      return res.status(500).json({ error: "HIT not created!" });
    }
    // TODO: Remove unneeded document fields
    const docRef = db.collection("MTurk").doc(linkedInId);
    await docRef.set({
      name: `${first} ${last}`,
      email,
      company,
      crunchbaseSlug,
    });

    return res.status(200).json({});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.response || error });
  }
}
