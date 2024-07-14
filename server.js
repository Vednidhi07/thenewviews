const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { URL } = require('url'); // Import URL module for URL parsing

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '/')));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Download HTML Source Code</title>
      <link rel="stylesheet" type="text/css" href="/styles.css">
    </head>
    <body>
      <div class="container">
        <h2>Download HTML Source Code</h2>
        <form action="/download" method="post">
          <label for="url">Enter URL or Domain Name:</label>
          <input type="text" id="url" name="url" required>
          <button type="submit">Download Source Code</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

app.post('/download', async (req, res) => {
  let url = req.body.url.trim();

  // Check if the input is just a domain name without protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `http://${url}`; // Assume HTTP protocol if none provided
  }

  try {
    const response = await axios.get(url);
    const htmlContent = response.data;

    // Parse the URL to get the hostname
    const parsedUrl = new URL(url);
    const domainName = parsedUrl.hostname;

    // Remove extension from domain name if it exists
    const domainWithoutExtension = domainName.replace(/\.[^/.]+$/, "");

    // Generate file path and name based on domain name without extension
    const fileName = `${domainWithoutExtension}.html`;
    const filePath = path.join(__dirname, fileName);

    // Write HTML content to file
    fs.writeFileSync(filePath, htmlContent);

    // Send the file as a download with the domain name as the filename
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error during file download:', err);
      }
      fs.unlinkSync(filePath); // Delete the file after sending it
    });
  } catch (error) {
    console.error('Error fetching the URL:', error);
    res.status(500).send('Error fetching the URL. Please try again.');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
