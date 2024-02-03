const fs = require('fs').promises;
const path = require('path');

const getVersion = async () => {
  const filePath = path.join(__dirname, 'version.json');

  try {
    // Read the content of the JSON file
    const content = await fs.readFile(filePath, 'utf-8');

    // Parse the JSON content
    const version = JSON.parse(content);

    return version;
  } catch (error) {
    console.error(`Error reading/parsing JSON file: ${error.message}`);
    return []; // Return an empty JSON array on fail
  }
};

//Export function
module.exports = { getVersion };