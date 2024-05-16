const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");

const { Server } = require("socket.io");

const app = express();
const port = 4000;
const host = "localhost";

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const server = http.createServer(app);
const io = new Server({
  cors: {
    origin: "*",
  },
  pingTimeout: 60000, // Timeout in milliseconds
  pingInterval: 25000,
})
io.attach(server);
const urlMap = new Map();
// to generate unqiue code 
const generateRandomCharacter = () => {
  const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randonCharacter = '';
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * base.length);
    randonCharacter += base.charAt(randomIndex);
  }
  return randonCharacter;
};

function sendMessage(event, url) {
  try {
    // the other side did not acknowledge the event in the given delay
    io.timeout(10000).emit(event, url)
  } catch (error) {
    console.log('error', error)
  }
}


app.post("/url", async (req, res) => {
  try {

    const { url } = req.body;

    const code = generateRandomCharacter()
    const shortUrl = `http://localhost:4000/${code}`;
    urlMap.set(code, url);
    const message = { event: 'shortenedUrl', url: shortUrl };
    sendMessage(message.event, message.url)
    return res.send("Ok");
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ message: 'Error shortening URL' });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      // if not id return 
      return res.status(400).json({ message: 'Error shortening URL' });
    }
    const url = urlMap.get(id);
    if (url) {
      return res.redirect(url);
    }
    else {
      return res.status(500).json({ message: 'URL Not found' });
    }
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ message: 'Error shortening URL' });
  }
});



server.listen(port, () => {
  console.log(
    `SERVER RUNNING AT Current ${host}:${port}`,
    "processID",
    process.pid
  );

});

io.on("connection", (socket) => {
  console.log("socket connected")

  socket.on("disconnect", () => {
    console.log('Client Disconnected  ')
  });
});