module.exports = {
    async getProducts(name, project) {
        try {
            const response = await axios.post('https://corefmv.smarttech.pe/fm/api/testronaldo/product/get', {
                "filters": ["name"],
                "where": {
                    "type": "ilike",
                    "conditional": {
                        "name": name
                    }
                }
            });
            const data = response.data.data;
            console.log("data", data);
            return data
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            throw new Error('No se pudo obtener los productos.');
        }
    }
}