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
            const search = req.query;
            const brand = req.query;
            const category = req.query;
            const price = req.query;


            // Search operation
            const searchQuery = search.search;
            if (search !== "") {
                const result = await productCollection.aggregate(
                    [
                        {
                            $match: {
                                $or: [
                                    { name: { $regex: searchQuery, $options: "i" } },
                                    { regularPrice: { $regex: searchQuery, $options: "i" } },
                                    { categories: { $regex: searchQuery, $options: "i" } },
                                    { brandName: { $regex: searchQuery, $options: "i" } },
                                ]
                            }
                        }
                    ]
                ).toArray();
                res.send(result);
                
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
