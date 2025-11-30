import express from "express";
import { Request, Response, NextFunction } from "express";
import APIConfig from './config.js';

const app = express(); // Create an express application
const PORT = 8080; // Set the port number

const handlerReadiness = (req: Request, res: Response) => {
    res.set("Content-Type", "text/plain");
    res.status(200).send("OK");
};

const middleWareLogResponses = (req: Request, res: Response, next: NextFunction) => {
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

const middlewareMetricInc = (req: Request, res: Response, next: NextFunction) => {
    APIConfig.fileserverHits++;
    next();
};

const middlewareDisplayMetrics = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send(`Hits: ${APIConfig.fileserverHits}`);
};

const middlewareResetMetrics = (req: Request, res: Response, next: NextFunction) => {
    APIConfig.fileserverHits = 0;
};

// Serve static files from the app directory
app.use("/app", middlewareMetricInc, middleWareLogResponses, express.static("./src/app"));
app.use(middleWareLogResponses); // Log responses for all requests

app.get("/healthz", middlewareMetricInc, handlerReadiness); // Health check endpoint
app.get("/metrics", middlewareDisplayMetrics); // Display number of requests made to server
app.get("/reset", middlewareResetMetrics); // Reset number of requests made to server to 0.

// Starts the server and listens for requests on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});