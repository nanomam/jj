// app.js
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Body parser middleware to parse request bodies
app.use(express.json());

// Route to handle the like button click
app.post('/like', (req, res) => {
  const likesFilePath = './likes.json';
  
  // Read the current likes from the file
  fs.readFile(likesFilePath, (err, data) => {
    if (err && err.code === 'ENOENT') {
      // If the file does not exist, create it with initial data
      const initialData = { likes: 1 };
      fs.writeFile(likesFilePath, JSON.stringify(initialData), (err) => {
        if (err) throw err;
        res.json(initialData);
      });
    } else if (err) {
      throw err;
    } else {
      // If the file exists, increment the like count and save
      const fileData = JSON.parse(data);
      fileData.likes += 1;
      fs.writeFile(likesFilePath, JSON.stringify(fileData), (err) => {
        if (err) throw err;
        res.json(fileData);
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
