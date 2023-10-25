require('dotenv').config()
const express = require('express')
const { getMedicines } = require('./notion')
const cors = require('cors')

const app = express()

app.use(cors())

app.get('/naturist', async (req, res) => {
    try {
        const nameFilter = req.query.nameFilter;

        // Call function getMedicines with filter (if exist)
        const medicines = await getMedicines({ nameFilter: nameFilter });

        res.json(medicines);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los medicamentos' });
    }
})

app.listen(process.env.PORT)