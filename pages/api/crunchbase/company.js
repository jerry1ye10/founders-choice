import { findPossibleCompanies } from "../../../utils/crunchbase";

export default async function getCompany(req, res) {
    if (req.method !== 'POST') {
        res.status(404);
        return;
    }
    if (!req.body.first || !req.body.last) {
        res.status(400).json({ error: "Invalid request" });
    }

    try {
        const companies = await findPossibleCompanies(req.body.first, req.body.last)
        return res.status(200).json(companies);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.response || error });
    }
}