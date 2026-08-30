import Url from "../models/url.js";
import shortid from "shortid";

// 1. Handle URL Shortening (POST /shorten)
export const getUrl = async (req, res) => {
  try {
    const originalUrl = req.body?.originalUrl;

    if (!originalUrl) {
      return res.status(400).send("Original URL is required");
    }

    const shortenedUrl = shortid.generate();
    const newUrl = new Url({ originalUrl, shortenedUrl });

    await newUrl.save();
    console.log("Url saved to database:", newUrl);

    const fullShortUrl = `${req.protocol}://${req.get("host")}/${shortenedUrl}`;
    return res.render("index.ejs", { shortenedUrl: fullShortUrl });
  } catch (error) {
    console.error("Error saving URL:", error);
    if (!res.headersSent) {
      return res.status(500).send("Server Error");
    }
  }
};

// 2. Handle Redirection (GET /:shortCode)
export const redirectToOriginal = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const urlRecord = await Url.findOne({ shortenedUrl: shortCode });

    if (!urlRecord) {
      return res.status(404).send("Short URL not found");
    }

    let target = urlRecord.originalUrl;
    if (!target.startsWith("http://") && !target.startsWith("https://")) {
      target = `https://${target}`;
    }

    return res.redirect(target);
  } catch (error) {
    console.error("Error redirecting:", error);
    if (!res.headersSent) {
      return res.status(500).send("Server Error");
    }
  }
};