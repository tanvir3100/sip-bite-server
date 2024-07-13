
const express = require('express')
const app = express()
const port = process.env.PORT || 4900;
const cors = require('cors')
require('dotenv').config()



//middleware
const corsOption = {
    origin: 'http://localhost:5173'
}

app.use(cors(corsOption))
app.use(express.json())



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://sipbite4900:xjEjGdm56X5Xx2K8@cluster0.huqehxg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const productsCollection = client.db("sipbite4900").collection("products");
        const chefsCollection = client.db("sipbite4900").collection("chefs");
        const popularCollection = client.db("sipbite4900").collection("popular");
        const recipesCollection = client.db("sipbite4900").collection("recipes");


        //products collection 
        app.get('/products', async (req, res) => {
            const result = await productsCollection.find().toArray();
            res.send(result)
        })

        //chefs collection
        app.get('/chefs', async (req, res) => {
            const result = await chefsCollection.find().toArray();
            res.send(result)
        })
        //popular collection 
        app.get('/popular', async (req, res) => {
            const result = await popularCollection.find().toArray();
            res.send(result)
        })

        //recipes collection
        app.get('/recipes', async (req, res) => {
            const result = await recipesCollection.find().toArray();
            res.send(result)
        })











        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello Food World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})