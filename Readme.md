# Web Scraper Backend for Apartments Rental

## Overview

This repository contains the backend for the web scraper project, designed to gather information about apartments available for rent. The backend is built with Node.js and utilizes web scraping techniques to fetch data from various websites. The gathered data is then made available for the frontend UI.

**Current Version: 0.6.0**

## Features

- **Node.js Server:** Backend server built with Node.js for handling web scraping tasks.
- **Express.js Framework:** Utilizes Express.js for creating a robust and scalable server.
- **Web Scraping:** Incorporates web scraping techniques to collect data from apartment rental websites.
- **API Endpoints:** Provides endpoints for the frontend UI to interact with and retrieve scraped data.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository: `git clone https://github.com/yourusername/webscraper-backend.git`
2. Navigate to the project directory: `cd webscraper-backend`
3. Install dependencies: `npm install`
4. Start the server: `npm start`

   The backend server should be accessible at [http://localhost:3300](http://localhost:3300).

## Usage

The backend server is designed to work in conjunction with the frontend UI. Ensure that the frontend is configured to communicate with this backend.

## API Endpoints

- **GET /apartments:** Retrieve a list of apartments based on the specified criteria.
- **GET /scrape:** Initiate the web scraping process with user-defined search parameters.

## Technologies Used

- Node.js
- Express.js

## License

This project is licensed under the [MIT License](LICENSE).
