const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware
const corsOption = {
    origin: 'http://localhost:5173', // Update with your front-end domain in production
};

app.use(cors(corsOption));
app.use(express.json());

// MongoDB connection URI
const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASS}@cluster0.huqehxg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Ensure the client connects to the MongoDB server
        await client.connect();

        const db = client.db("sipbite4900");
        const productsCollection = db.collection("products");
        const chefsCollection = db.collection("chefs");
        const popularCollection = db.collection("popular");
        const recipesCollection = db.collection("recipes");

        // Products collection routes
        app.get('/products', async (req, res) => {
            const result = await productsCollection.find().toArray();
            res.send(result)
        });
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productsCollection.findOne(query)
            res.send(result);
        })
        app.patch('/products/:id', async (req, res) => {
            const item = req.body;
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    title: item.title,
                    image: item.image,
                    price: item.price,
                    short_description: item.short_description
                }
            }
            const result = await productsCollection.updateOne(filter, updateDoc);
            res.send(result)
        })

        app.post('/products', async (req, res) => {
            try {
                const productItem = req.body;
                if (!productItem.title || !productItem.image || !productItem.price || !productItem.description) {
                    return res.status(400).send({ error: 'Missing required fields' });
                }
                const result = await productsCollection.insertOne(productItem);
                res.status(201).send(result);
            } catch (error) {
                res.status(500).send({ error: 'Failed to insert product', details: error.message });
            }
        });




        // Other collections (chefs, popular, recipes)...
        app.get('/chefs', async (req, res) => {
            try {
                const result = await chefsCollection.find().toArray();
                res.send(result);
            } catch (error) {
                console.error('Failed to fetch chefs:', error);
                res.status(500).send({ error: 'Failed to fetch chefs' });
            }
        });



        //Popular related section 
        app.get('/popular', async (req, res) => {
            try {
                const result = await popularCollection.find().toArray();
                res.send(result);
            } catch (error) {
                console.error('Failed to fetch popular items:', error);
                res.status(500).send({ error: 'Failed to fetch popular items' });
            }
        });
        app.get('/popular/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await popularCollection.findOne(query)
            res.send(result);
        })
        app.patch('/popular/:id', async (req, res) => {
            const item = req.body;
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    title: item.title,
                    image: item.image,
                    price: item.price,
                    short_description: item.short_description
                }
            }
            const result = await popularCollection.updateOne(filter, updateDoc);
            res.send(result)
        })

        app.get('/recipes', async (req, res) => {
            try {
                const result = await recipesCollection.find().toArray();
                res.send(result);
            } catch (error) {
                console.error('Failed to fetch recipes:', error);
                res.status(500).send({ error: 'Failed to fetch recipes' });
            }
        });

        // Ping the database to confirm connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. Successfully connected to MongoDB!");
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); // Exit the process with failure
    }
}
run().catch(console.dir);

// Basic route
app.get('/', (req, res) => {
    res.send('Hello Food World!');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    await client.close();
    console.log("MongoDB client disconnected on app termination");
    process.exit(0);
});
