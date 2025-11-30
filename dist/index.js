import express from "express";
import APIConfig from './config.js';
const app = express(); // Create an express application
const PORT = 8080; // Set the port number
const handlerReadiness = (req, res) => {
    res.set("Content-Type", "text/plain");
    res.status(200).send("OK");
};
const middleWareLogResponses = (req, res, next) => {
    const method = req.method;
    const url = req.url;
    res.set("Cache-Control", "no-cache");
    // Log the response status code when the response is finished and not in the 200-299 range
    res.on("finish", () => {
        const { statusCode } = res;
        if (statusCode < 200 || statusCode >= 300 && statusCode !== 304) {
            console.log(`[NON-OK] ${method} ${url} - Status: ${statusCode}`);
        }
    });
    next(); // Continue to the next middleware or route handler
};
// ROUTE HANDLERS
const middlewareMetricInc = (req, res, next) => {
    APIConfig.fileserverHits++;
    next();
};
const middlewareDisplayMetrics = (req, res, next) => {
    res.set("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(`
<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${APIConfig.fileserverHits} times!</p>
  </body>
</html>
        `);
};
const middlewareResetMetrics = (req, res, next) => {
    APIConfig.fileserverHits = 0;
    res.status(200).send("OK");
};
/* Custom JSON Encode / Decode for transfering data over the network */
// Decode JSON body from request
const decodeData = async (req, res, next) => {
    try {
        // If the number of characters is more than 140 in body.
        if (req.body.body.length > 140) {
            res.status(400).json({ error: "Chirp is too long" });
            return;
        }
        // Replace all profane words in data
        const words = req.body.body.split(' ');
        for (let i = 0; i < words.length; i++) {
            if (words[i].toLowerCase() === "kerfuffle"
                || words[i].toLowerCase() === "sharbert"
                || words[i].toLowerCase() === "fornax") {
                words[i] = "****";
            }
            req.body.cleanedBody = words.join(' ');
        }
        next();
    }
    catch (error) {
        res.status(400).json({ error: "Something Went wrong" }); // Set content type to json and send stringified object
    }
};
// Encode object data to JSON
const encodeData = async (req, res) => {
    res.header("Content-Type", "application/json"); // Letting the server know that we expect data in the form of JSON
    res.status(200).json(req.body); // Send the JSON encoded response body to the client
};
// Serve static files from the app directory
app.use("/app", middlewareMetricInc, middleWareLogResponses, express.static("./src/app"));
app.use(express.json()); // Add express.json() middleware Before Routes that need it
// ROUTES
app.get("/api/healthz", middlewareMetricInc, handlerReadiness); // Health check endpoint
app.get("/admin/metrics", middlewareDisplayMetrics); // Display number of requests made to server
app.post("/admin/reset", middlewareResetMetrics); // Reset number of requests made to server to 0.
app.post("/api/validate_chirp", decodeData, encodeData);
app.use(middleWareLogResponses); // Log responses for all requests
// Starts the server and listens for requests on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
