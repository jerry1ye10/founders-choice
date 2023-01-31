import { getInvestorBySlug } from "../../../utils/crunchbase";

export default async function getCompany(req, res) {
  if (req.method !== "POST") {
    res.status(404);
    return;
  }
  if (!req.body.slug) {
    res.status(400).json({ error: "Invalid request" });
  }

  try {
    const { slug } = req.body;
    const properties = await getInvestorBySlug(slug);
    if (
      properties.investor_type &&
      properties.investor_type &&
      !properties.investor_type.includes("angel")
    ) {
      return res.status(200).json(
        properties.identifier
          ? {
              id: properties?.identifier?.uuid ?? null,
              image: properties?.image_url ?? null,
              name: properties?.identifier?.value ?? null,
              slug: properties?.identifier?.permalink ?? null,
            }
          : null
      );
    } else {
      throw Error("invalid Investor");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.response || error });
  }
}
