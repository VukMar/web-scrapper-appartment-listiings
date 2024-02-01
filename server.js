const express = require('express');
const { scrape } = require('./scraper');
const path = require('path');
const { fetchApartments } = require('./getAptList');

const startServer = () => {
    const app = express();
    const port = process.env.PORT || 3300;

    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/scrape', async (req, res) => {
    try {
        await scrape();
        res.json({ success: true, message: 'Scraping completed successfully.' });
    } catch (error) {
        console.error('Error during scraping:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    });

    app.get('/Apartment List', async (req, res) => {
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
