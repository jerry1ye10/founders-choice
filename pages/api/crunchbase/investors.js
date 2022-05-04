import { getInvestors, createInvestor } from "../../../utils/crunchbase";

export default async function getCompany(req, res) {
  if (req.method !== "POST") {
    res.status(404);
    return;
  }
  if (!req.body.company) res.status(400);

  try {
    const investorRes = await getInvestors(req.body.company);
    let investors = investorRes.filter((investor) => {
      if (investor.investor_type === undefined) {
        return false;
      } else {
        return investor.investor_type.includes("angel") === false;
      }
    });
    if (!investors) {
      investors = investorRes;
    }
    const formattedInvestors = investors.map((i) => ({
      image: i?.image_url,
      name: i?.identifier?.value,
      id: i?.identifier?.uuid,
      slug: i?.identifier?.permalink,
    }));
    let finalizedInvestors = formattedInvestors;
    if (req.body.additionalInvestors) {
      finalizedInvestors = formattedInvestors.concat(
        req.body.additionalInvestors
      );
    }
    finalizedInvestors.forEach((investor) => {
      createInvestor(investor);
    });
    return res.status(200).json({
      investors: finalizedInvestors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.response || error });
  }
}
