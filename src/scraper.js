const cheerio = require('cheerio');
const { json } = require('express');
const { Console } = require('console');
const axios = require('axios');
const path = require('path');

class Apartment
{
    constructor(link,price)
    {
        this.link = link;
        this.price = price;
    }
}

const getApartmentInfo = async (ApartmentLink) => 
{
    try {
        const response = await axios.get(ApartmentLink); // Send an HTTP GET request to the specified page URL using Axios
        const $ = cheerio.load(response.data); // Load the response data into Cheerio to parse it as HTML
        const price = $('ul.list-group li:first span.fw-bold:last').text();
        await new Promise(resolve => setTimeout(resolve, 1000));
        return price;
    } catch (error) {
        throw error; // Throw the error if the request fails
    }
}


const getPageCount = async () => {
    const baseUrl = 'https://www.nadjidom.com/sr/nekretnine/izdavanje/stanovi+Novi+Sad';
    try {
        const response = await axios.get(baseUrl); // Send an HTTP GET request to the specified page URL using Axios
        const $ = cheerio.load(response.data); // Load the response data into Cheerio to parse it as HTML
        const pageCount = parseInt($('ul.pagination li:last-child a').text());
        await new Promise(resolve => setTimeout(resolve, 1000));
        return pageCount;
    } catch (error) {
        throw error; // Throw the error if the request fails
    }
};

const getPageData = async (pageUrl) => {
    try {
        const response = await axios.get(pageUrl); // Send an HTTP GET request to the specified page URL using Axios
        const $ = cheerio.load(response.data); // Load the response data into Cheerio to parse it as HTML
        const divs = $('div.estate-loop'); // Select all divs with the class 'estate-loop'
        const scrapped_hrefs = divs.find('a').map((i, el) => $(el).attr('href')).get(); // Extract the href attributes of all <a> tags within those divs
        let uniquehrefs = scrapped_hrefs.reduce((acc, curr) => { // Remove duplicates from the list of hrefs
            if (!acc.includes(curr)) {
                acc.push(curr);
            }
            return acc;
        }, []);
        console.log(`Found ${uniquehrefs.length} apartments on page.`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return uniquehrefs; // Return the unique hrefs
    } catch (error) {
        throw error; // Throw the error if the request fails
    }
};

const writeListToJSON = async (apartmentLinks) =>
{
    const fs = require('fs');
    const directoryPath = path.join( __dirname, 'ApartmentLists');
    
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
    }
    
    //Create list
    let ApartmentList = [];
    for(let i = 0; i <  apartmentLinks.length; i++)
    {
        console.log(`Writing apartment ${i+1} of ${apartmentLinks.length}`);

        const price = await getApartmentInfo(apartmentLinks[i]);

        if(isNaN(price)){
            price = Number(price);
        }

        if(price > minPrice && price < maxPrice){
            ApartmentList.push(new Apartment(apartmentLinks[i],price));
        }
    }

    const fileNamePath = path.join(directoryPath, 'ApartmentList.json');

    //Write list to file
    fs.writeFileSync(fileNamePath, JSON.stringify(ApartmentList, null, 4));
}

const scrape = async (pageCount,minPrice,maxPrice) => {
    //Start
    console.log('Scraping...');
    
    //Get starting time point of duration count
    const start = performance.now();
    
    //Base url and page url for the webiste
    const baseUrl = 'https://www.nadjidom.com/sr/nekretnine/izdavanje/stanovi+Novi+Sad';
    const pageUrlTemplate = `${baseUrl}&offset=%d`;
    
    //Get apartment list
    let apartmentLinks = [];
    console.log(`Pages to check: ${pageCount}`);
    for (let i = 0; i < pageCount; i++) {
        console.log(`Checking page: ${i+1}`);
        const pageUrl = pageUrlTemplate.replace('%d', i * 20);
        const pageData = await getPageData(pageUrl);
        apartmentLinks = apartmentLinks.concat(pageData);
    }

    //Save apartment list to file
    console.log('Writing apartment list to file...');
    const filesaveInfo = await writeListToJSON(apartmentLinks,minPrice,maxPrice);
    console.log(`DONE!`);

    //Get end time point of duration count and calculate
    const end = performance.now();
    console.log(`Time needed: ${(end - start)/1000}seconds`);
};

//Export function for use by the server
module.exports = { scrape, getPageCount };

