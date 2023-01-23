import { getCompanyBySlug } from "../../../utils/crunchbase";

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
    const properties = await getCompanyBySlug(slug);
    return res.status(200).json({
      company: properties?.identifier?.value ?? null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.response || error });
  }
}
