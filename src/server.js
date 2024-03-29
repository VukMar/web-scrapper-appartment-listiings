const express = require('express');
const { scrape, getPageCount } = require('./scraper');
const path = require('path');
const { fetchApartments } = require('./getAptList');
const cors = require('cors');
const { getVersion } = require('./getVersion');

const startServer = () => {
    const app = express();
    const port = process.env.PORT || 5000;

    app.use(express.json());

    app.use(cors({
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    }));

    app.use(express.static(path.join(__dirname, 'public')));

    app.post('/scrape', async (req, res) => {
    try {
        const POST = req.body;

        let pagesToScrape = POST.pgeCount;
        let minPrice = POST.priceMin;
        let maxPrice = POST.priceMax;
    
        if (isNaN(pagesToScrape) || pagesToScrape <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid input for pagesToScrape' });
        }

        await scrape(pagesToScrape,minPrice,maxPrice);
    
        res.json({ success: true, message: 'Scraping completed successfully.' });
    } catch (error) {
        console.error('Error during scraping:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    });

    app.get('/getPageCount' , async (req,res) => {
    try{
        const pageCount = await getPageCount();
        res.json({ success: true, message: pageCount });
    }catch{
        console.error('Error during fetch:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    })

    app.get('/getVersion' , async (req,res) => {
        try{
            const version = await getVersion();
            res.json({ success: true, message: version });
        }catch{
            console.error('Error during fetch:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
        })

    app.get('/getAptList', async (req, res) => {
    try{
        const aptList = await fetchApartments();
        res.json({ success: true, message: aptList });
    }catch (error) {
        console.error('Error during fetch:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    });

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

module.exports = {startServer};
