import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import mongoose from "mongoose";
import "dotenv/config";
import routes from "./src/routes/index.js";

const app = express();

console.log("Environment Variables:");
console.log("MongoDB URL:", process.env.MONGODB_URL);
console.log("PORT:", process.env.PORT || 5000);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}, Request Method: ${req.method}`);
    next();
});

app.use("/api/v1", routes);

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

const port = process.env.PORT || 5000;
const server = http.createServer(app);

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("MongoDB connected successfully");
        server.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    });

app.use((err, req, res, next) => {
    console.error('Error in request handling:', err);
    res.status(500).send('Internal Server Error');
});

export default app;
