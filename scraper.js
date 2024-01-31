const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

class Apartment {
  constructor(link, price) {
    this.link = link;
    this.price = price;
  }
}

const getApartmentInfo = async (ApartmentLink) => {
  try {
    const response = await axios.get(ApartmentLink);
    const $ = cheerio.load(response.data);
    const price = $('ul.list-group li:first span.fw-bold:last').text();
    await new Promise(resolve => setTimeout(resolve, 1000));
    return price;
  } catch (error) {
    throw error;
  }
}

const getPageData = async (pageUrl) => {
  try {
    const response = await axios.get(pageUrl);
    const $ = cheerio.load(response.data);
    const divs = $('div.estate-loop');
    const scrapped_hrefs = divs.find('a').map((i, el) => $(el).attr('href')).get();
    let uniquehrefs = scrapped_hrefs.reduce((acc, curr) => {
      if (!acc.includes(curr)) {
        acc.push(curr);
      }
      return acc;
    }, []);
    console.log(`Found ${uniquehrefs.length} apartments on page.`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return uniquehrefs;
  } catch (error) {
    throw error;
  }
};

const writeListToJSON = async (apartmentLinks) => {
  let ApartmentList = [];
  for (let i = 0; i < apartmentLinks.length; i++) {
    console.log(`Writing apartment ${i+1} of ${apartmentLinks.length}`);
    const price = await getApartmentInfo(apartmentLinks[i]);
    ApartmentList.push(new Apartment(apartmentLinks[i], price));
  }
  fs.writeFileSync('ApartmentLists/ApartmentList.json', JSON.stringify(ApartmentList));
  console.log(`DONE writing ${ApartmentList.length} apartments to file`);
}

const scrape = async () => {
  console.log('Scraping...');

  const baseUrl = 'https://www.nadjidom.com/sr/nekretnine/izdavanje/stanovi+Novi+Sad';
  const pageUrlTemplate = `${baseUrl}&offset=%d`;

  let pageCount, apartmentLinks = [];
  try {
    const response = await axios.get(baseUrl);
    const $ = cheerio.load(response.data);
    pageCount = parseInt($('ul.pagination li:last-child a').text());
  } catch (error) {
    throw error;
  }

  console.log(`Pages to check: ${pageCount}`);
  for (let i = 0; i < pageCount; i++) {
    console.log(`Checking page: ${i+1}`);
    const pageUrl = pageUrlTemplate.replace('%d', i * 20);
    const pageData = await getPageData(pageUrl);
    apartmentLinks = apartmentLinks.concat(pageData);
  }

  console.log(`Total apartments found: ${apartmentLinks.length}`);
  await writeListToJSON(apartmentLinks);
};

scrape();
