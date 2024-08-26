const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://sip-bite.web.app'
    ],
}

app.use(cors(corsOptions));
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
        const reviewsCollection = db.collection("reviews");

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

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productsCollection.deleteOne(query);
            res.send(result)
        })



        // Other collections (chefs, popular, recipes)...
        //Chefs collection section 
        app.get('/chefs', async (req, res) => {
            try {
                const result = await chefsCollection.find().toArray();
                res.send(result);
            } catch (error) {
                console.error('Failed to fetch chefs:', error);
                res.status(500).send({ error: 'Failed to fetch chefs' });
            }
        });

        app.get('/chefs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await chefsCollection.findOne(query)
            res.send(result);
        })

        app.post('/chefs', async (req, res) => {
            try {
                const recipeItem = req.body;
                if (!recipeItem.title || !recipeItem.image || !recipeItem.price || !recipeItem.description) {
                    return res.status(400).send({ error: 'Missing required fields' });
                }
                const result = await chefsCollection.insertOne(recipeItem);
                res.status(201).send(result);
            } catch (error) {
                res.status(500).send({ error: 'Failed to insert recipe', details: error.message });
            }
        });

        app.patch('/chefs/:id', async (req, res) => {
            const item = req.body;
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    name: item.name,
                    title: item.title,
                    image: item.image,
                    bio: item.bio
                }
            }
            const result = await chefsCollection.updateOne(filter, updateDoc);
            res.send(result)
        })

        app.delete('/chefs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await chefsCollection.deleteOne(query);
            res.send(result)
        })



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

        //Recipes Section
        app.get('/recipes', async (req, res) => {
            try {
                const result = await recipesCollection.find().toArray();
                res.send(result);
            } catch (error) {
                console.error('Failed to fetch recipes:', error);
                res.status(500).send({ error: 'Failed to fetch recipes' });
            }
        });

        app.get('/recipes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await recipesCollection.findOne(query)
            res.send(result);
        })

        app.post('/recipes', async (req, res) => {
            try {
                const recipeItem = req.body;
                if (!recipeItem.title || !recipeItem.image || !recipeItem.price || !recipeItem.description) {
                    return res.status(400).send({ error: 'Missing required fields' });
                }
                const result = await recipesCollection.insertOne(recipeItem);
                res.status(201).send(result);
            } catch (error) {
                res.status(500).send({ error: 'Failed to insert recipe', details: error.message });
            }
        });

        app.patch('/recipes/:id', async (req, res) => {
            const item = req.body;
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    title: item.title,
                    image: item.image,
                    ingredients: item.ingredients,
                    recipe: item.recipe
                }
            }
            const result = await recipesCollection.updateOne(filter, updateDoc);
            res.send(result)
        })

        app.delete('/recipes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await recipesCollection.deleteOne(query);
            res.send(result)
        })

        //Reviews Section 
        app.get('/reviews', async (req, res) => {
            try {
                const result = await reviewsCollection.find().toArray();
                res.send(result);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
                res.status(500).send({ error: 'Failed to fetch reviews' });
            }
        });

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await reviewsCollection.findOne(query)
            res.send(result);
        })

        app.post('/reviews', async (req, res) => {
            try {
                const reviewItem = req.body;
                if (!reviewItem.title || !reviewItem.image || !reviewItem.price || !reviewItem.description) {
                    return res.status(400).send({ error: 'Missing required fields' });
                }
                const result = await reviewsCollection.insertOne(reviewItem);
                res.status(201).send(result);
            } catch (error) {
                res.status(500).send({ error: 'Failed to insert review', details: error.message });
            }
        });

        app.patch('/reviews/:id', async (req, res) => {
            const item = req.body;
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    name: item.name,
                    description: item.description,
                }
            }
            const result = await reviewsCollection.updateOne(filter, updateDoc);
            res.send(result)
        })

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await reviewsCollection.deleteOne(query);
            res.send(result)
        })

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
