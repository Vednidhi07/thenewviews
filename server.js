const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const app = express();
const port = 3000;

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
        <form id="sourceCodeForm">
          <label for="url">Enter URL or Domain Name:</label>
          <input type="text" id="url" name="url" required>
          <button type="button" id="getSourceCodeButton">Get Source Code</button>
        </form>
        <div id="sourceCodeContainer" style="display: none;">
          <h3>Source Code:</h3>
          <pre id="sourceCode"></pre>
        </div>
        <div class="button-container" style="display: none;">
          <button id="copyButton">Copy to Clipboard</button>
          <form id="downloadForm" action="/download-file" method="post">
            <input type="hidden" id="hiddenUrl" name="url">
            <button type="submit" class="download-button">Download Source Code</button>
          </form>
        </div>
      </div>
      <script>
        document.getElementById('getSourceCodeButton').addEventListener('click', async () => {
          const url = document.getElementById('url').value;

          if (url) {
            try {
              const response = await fetch('/download', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ url }),
              });

              if (response.ok) {
                const data = await response.json();
                document.getElementById('sourceCode').textContent = data.htmlContent;
                document.getElementById('hiddenUrl').value = url;
                document.getElementById('sourceCodeContainer').style.display = 'block';
                document.querySelector('.button-container').style.display = 'flex';
              } else {
                alert('Error fetching the URL. Please try again.');
              }
            } catch (error) {
              console.error('Error fetching the URL:', error);
              alert('Error fetching the URL. Please try again.');
            }
          }
        });

        document.getElementById('copyButton').addEventListener('click', () => {
          const sourceCode = document.getElementById('sourceCode');
          const range = document.createRange();
          range.selectNode(sourceCode);
          window.getSelection().removeAllRanges(); 
          window.getSelection().addRange(range); 
          try {
            document.execCommand('copy');
            alert('Source code copied to clipboard');
          } catch (err) {
            alert('Failed to copy text');
          }
          window.getSelection().removeAllRanges();
        });
      </script>
    </body>
    </html>
  `);
});

app.post('/download', async (req, res) => {
  let url = req.body.url.trim();

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `http://${url}`;
  }

  try {
    const response = await axios.get(url);
    const htmlContent = response.data;

    res.send({ htmlContent });
  } catch (error) {
    console.error('Error fetching the URL:', error);
    res.status(500).send('Error fetching the URL. Please try again.');
  }
});

app.post('/download-file', async (req, res) => {
  let url = req.body.url.trim();

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `http://${url}`;
  }

  try {
    const response = await axios.get(url);
    const htmlContent = response.data;

    const parsedUrl = new URL(url);
    const domainName = parsedUrl.hostname;
    const domainWithoutExtension = domainName.replace(/\.[^/.]+$/, "");

    const fileName = `${domainWithoutExtension}.html`;
    const filePath = path.join(__dirname, fileName);

    fs.writeFileSync(filePath, htmlContent);

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error during file download:', err);
      }
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error('Error fetching the URL:', error);
    res.status(500).send('Error fetching the URL. Please try again.');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
