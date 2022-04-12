import eloRating from "elo-rating";
import crypto from "crypto";
import { db, admin } from "./firebase";

async function saveComparison(transaction, VC1, VC2, result, profileId) {
  const founderHash = crypto
    .createHash("sha256")
    .update(profileId + process.env.CRYPTO_SALT)
    .digest("base64")
    .split("/")
    .join("!");
  const founderRef = db.collection("Founders").doc(founderHash);
  //if (VC1 > VC2) [VC1, VC2] = [VC2, VC1];
  const objToRemove = {
    vc1: VC1,
    vc2: VC2,
  };
  transaction.update(founderRef, {
    comparisons: admin.firestore.FieldValue.arrayRemove(objToRemove),
  })
}

// TODO: handle ties
export async function updateElo(VC1, VC2, res, profileId) {
  return await db.runTransaction(async t => {
    const VC1Ref = db.collection("Investors").doc(VC1.name);
    const doc1 = await t.get(VC1Ref);
    const VC2Ref = db.collection("Investors").doc(VC2.name);
    const doc2 = await t.get(VC2Ref);
    const expectation1 = eloRating.expected(doc1.data().elo, doc2.data().elo);
    const expectation2 = 1 - expectation1;

    let result1;
    let result2;
  
    if (res === VC1.slug) {
      result1 = 32 * (1 - expectation1);
      result2 = 32 * (0 - expectation2);
    } else if (res === VC2.slug) {
      result1 = 32 * (0 - expectation1);
      result2 = 32 * (1 - expectation2);
    } else {
      result1 = 32 * (0.5 - expectation1);
      result2 = 32 * (0.5 - expectation2);
    }

    t.update(VC1Ref, {
      elo: doc1.data().elo + result1,
      numComparisons: doc1.data().numComparisons + 1,
    });
    t.update(VC2Ref, {
      elo: doc2.data().elo + result2,
      numComparisons: doc2.data().numComparisons + 1,
    })

    await saveComparison(t, VC1.name, VC2.name, res, profileId);
  })
}
