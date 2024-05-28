const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./queries");
const cors = require('cors');
const path = require("path");
const port = process.env.PORT || 4000;

require("dotenv").config();

app.use(cors({
    origin: '*'
    }));

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(express.static(path.join(__dirname + "/semester_projekt")));

app.get("/", (request, response) => {
    response.sendFile(__dirname + "/index.html")
}); 


app.get("/energy", db.getEnergy);
app.post("/insert-energy", db.insertEnergy);
app.post("/populateEnergy", db.populateEnergy);

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});