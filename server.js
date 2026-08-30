import express from "express";
import mongoose from "mongoose";
import { getUrl,redirectToOriginal } from "./controllers/url.js";


const app = express();

app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://abhayk78554_db_user:36ZyQzoD7uLOV2t5@cluster0.jkktkek.mongodb.net/",{
    dbName: "urlShortner",
}).then(() => {
    console.log("Database connected");
}).catch((err) => {
    console.log(err);
}); 

app.get("/", (req, res) => {
    res.render("index.ejs", { shortenedUrl: null } );
});

app.post("/shorten", getUrl);

app.get("/:shortCode", redirectToOriginal);


const PORT = process.env.PORT || 1000;

app.listen(port, () => { console.log(`server is running on port ${port}`) });

