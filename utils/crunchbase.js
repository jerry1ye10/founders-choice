import ky from "ky-universal";
import { db } from "./firebase";

const API_KEY = "" || process.env.CRUNCHBASE_API_KEY;
const PEOPLE_ENDPOINT = `https://api.crunchbase.com/api/v4/searches/people?user_key=${API_KEY}`;
const COMPANIES_ENDPOINT = `https://api.crunchbase.com/api/v4/searches/organizations?user_key=${API_KEY}`;
const INVESTORS_ENDPOINT = (companyID) =>
  `https://api.crunchbase.com/api/v4/entities/organizations/${companyID}?card_ids=investors&user_key=${API_KEY}`;

// TODO: Update with what kinds of investors we allow in the rankings
const ALLOWED_INVESTOR_TYPES = [`venture_capital`];

async function findPossibleIdentities(firstName, lastName) {
  const query = {
    field_ids: ["first_name", "last_name", "linkedin"],
    query: [
      {
        type: "predicate",
        field_id: "last_name",
        operator_id: "eq",
        values: [lastName],
      },
      {
        type: "predicate",
        field_id: "first_name",
        operator_id: "eq",
        values: [firstName],
      },
    ],
  };
  const resp = await ky.post(PEOPLE_ENDPOINT, { json: query }).json();
  return resp.entities;
}

export async function findPossibleCompanies(firstName, lastName) {
  const possibleIdentities = await findPossibleIdentities(firstName, lastName);
  const validPeople = possibleIdentities.map((i) => i.uuid);
  const body = {
    field_ids: ["identifier", "legal_name"],
    order: [
      {
        field_id: "rank_org",
        sort: "asc",
      },
    ],
    query: [
      {
        type: "predicate",
        field_id: "founder_identifiers",
        operator_id: "includes",
        values: validPeople,
      },
    ],
    limit: 50,
  };
  var resp = await ky.post(COMPANIES_ENDPOINT, { json: body }).json();
  if (isEmpty(validPeople)) {
    resp.entities = [];
  }

  return resp;
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export async function getInvestors(companyId) {
  try {
    const companiesInvestors = await (
      await ky.get(INVESTORS_ENDPOINT(companyId), {
        headers: { Accept: "application/json" },
      })
    ).json();
    return companiesInvestors;
  } catch (error) {
    const exceptionsRef = db.collection("AdditionalFounders");
    const data = await exceptionsRef
      .where("companyName", "==", companyId)
      .get();
    console.log(data);
    if (data.empty) {
      return;
    } else {
      return [];
    }
  }
}

export async function createInvestor(investor) {
  const investorRef = db.collection("Investors").doc(investor.name);
  const doc = await investorRef.get();
  if (!doc.exists) {
    const investorData = {
      elo: 1000,
      name: investor.name,
      numComparisons: 0,
    };
    investorRef.set(investorData);
  }
}
