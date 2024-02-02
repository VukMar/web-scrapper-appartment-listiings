const express = require('express');
const { scrape, getPageCount } = require('./scraper');
const path = require('path');
const { fetchApartments } = require('./getAptList');
const cors = require('cors');

const startServer = () => {
    const app = express();
    const port = process.env.PORT || 5000;

    app.use(cors({
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    }));

    app.use(express.static(path.join(__dirname, 'public')));

    app.post('/scrape', async (req, res) => {
    try {
        const { pagesToScrape } = req.body;
    
        if (!Number.isInteger(pagesToScrape) || pagesToScrape <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid input for pagesToScrape' });
        }

        await scrape(pagesToScrape);
    
        res.json({ success: true, message: 'Scraping completed successfully.' });
    } catch (error) {
        console.error('Error during scraping:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    });

    app.get('/getPageCount' , async (req,res) => {
    try{
        const aptList = await getPageCount();
        res.json({ success: true, message: aptList });
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
