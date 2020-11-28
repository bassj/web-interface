import {getCatalog} from '../model/catalog'

export default async (req, res) => {
    try {
        const seriesCatalog = await getCatalog();

        res.json(seriesCatalog);
    } catch (e) {
        console.error(e);
        res.status(500).send();
    }
};