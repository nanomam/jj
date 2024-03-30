const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

// Initial like count (stored in likes.json)
let likes = 0;

// Load initial like count from JSON file (error handling included)
try {
  const data = fs.readFileSync('likes.json', 'utf8');
  likes = JSON.parse(data).likes || 0; // Default to 0 if no initial value
} catch (err) {
  console.error('Error reading likes.json:', err);
}

// Route to serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Route to handle like button clicks (asynchronous for smoother experience)
app.post('/like', async (req, res) => {
  try {
    likes++; // Increment like count
    await fs.promises.writeFile('likes.json', JSON.stringify({ likes })); // Update JSON file
    res.json({ likes }); // Send updated like count back to client
  } catch (err) {
    console.error('Error updating likes.json:', err);
    res.status(500).json({ error: 'Failed to update likes' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
