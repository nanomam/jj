const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3001;

// Function to read like count from  file
function readLikeCount() {
  try {
    const data = fs.readFileSync("likeCount.json", "utf8");
    return JSON.parse(data).count;
  } catch (err) {
    // If file doesn't exist or there's an error, return 0
    return 0;
  }
}

// Function to write like count to file
function writeLikeCount(count) {
  const data = { count: count };
  fs.writeFileSync("likeCount.json", JSON.stringify(data));
}

app.get("/", (req, res) => {
  const likeCount = readLikeCount();
  res.type('html').send(html.replace('{{likeCount}}', likeCount.toString()));
});

app.post("/like", (req, res) => {
  let likeCount = readLikeCount();
  likeCount++;
  writeLikeCount(likeCount);
  res.sendStatus(200);
});

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      document.addEventListener("DOMContentLoaded", function() {
        const likeButton = document.getElementById('likeButton');
        const likeCountDisplay = document.getElementById('likeCount');

        likeButton.addEventListener('click', function() {
          fetch('/like', { method: 'POST' })
            .then(() => {
              let likeCount = parseInt(likeCountDisplay.textContent);
              likeCount++;
              likeCountDisplay.textContent = likeCount;
              likeButton.disabled = true;
            })
            .catch(err => console.error('Error liking:', err));
        });
      });
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      <h1>Hello from Render!</h1>
      <p>Like count: <span id="likeCount">{{likeCount}}</span></p>
      <button id="likeButton">Like</button>
    </section>
  </body>
</html>
`
