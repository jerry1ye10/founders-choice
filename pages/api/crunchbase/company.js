import { findPossibleCompanies } from "../../../utils/crunchbase";
import { db } from "../../../utils/firebase"

export default async function getCompany(req, res) {
    if (req.method !== 'POST') {
        res.status(404);
        return;
    }
    if (!req.body.first || !req.body.last) {
        res.status(400).json({ error: "Invalid request" });
    }

    try {
        const { first, last } = req.body
        const companies = await findPossibleCompanies(first, last)
        const companyOptions = companies.map((c) => ({
            value: c?.properties?.identifier?.permalink,
            label: c?.properties?.identifier?.value,
        }));

        // Inject manual founder-company matches
        const overriddenCompanySnapshot = await db.collection("AdditionalFounders").doc(`${first} ${last}`).get()
        if (overriddenCompanySnapshot?.exists) {
            const overriddenCompany = await overriddenCompanySnapshot.data()
            const { slug, companyName } = overriddenCompany; 
            companyOptions.push({
                value: slug,
                label: companyName,
            });
        }

        return res.status(200).json({
            options: companyOptions
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.response || error });
    }
}