import express from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion } from 'mongodb';
import 'dotenv/config'

const app = express();
const port = 7000;


// connection url
const uri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.fp7vkua.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Middleware
app.use(cors());

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// main functions
async function run() {
    try {

        // create database
        const productCollection = client.db("eVoucher").collection("allProducts");



        // get all products api
        app.get("/all-products", async (req, res) => {
            const result = await productCollection.find().toArray();

            res.send(result);
        })

        // All operations api
        app.get("/products", async (req, res) => {
            const { search, brand, category, price } = req.query;

            const queryData = {};

            // Search operation
            if (search) {
                queryData.$or = [
                    { name: { $regex: search, $options: "i" } },
                    { regularPrice: { $regex: search, $options: "i" } },
                    { categories: { $regex: search, $options: "i" } },
                    { brandName: { $regex: search, $options: "i" } }
                ];
            }
            if (brand) {
                queryData.brandName = brand;
            }
            if (category) {
                queryData.categories = category;
            }
            if (price) {
                const priceNumber = parseFloat(price);
                queryData.$expr = {
                    $lt: [{ $toDouble: "$regularPrice" }, priceNumber]
                };
            }

            try {

                const result = await productCollection.find(queryData).toArray();
                res.send(result);

            }
            catch (error) {
                res.status(500).send({ message: "Internal Server Error" });
            }



        })




        // Test api
        app.get("/", (req, res) => {
            res.send("hello Abumahid")
        })


    } catch (err) {
        console.log(err)
    }
}
run().catch(console.dir);


//  port listening

app.listen(port, () => console.log("Server is running on: ", port));
