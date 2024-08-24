const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// middleware
app.use(cors());
app.use(express.json());

// artistMaster
// 4K5O1hUPWSGpqBUr

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bwwdqjn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    // Creting collections
    const artCollection = client.db("artDB").collection("art");
    const subCatCollection = client.db("artDB").collection("subCat");
    // POST----------------------
    app.post('/art', async (req, res) => {
      const newArt = req.body;
      console.log(newArt);
      const result = await artCollection.insertOne(newArt);
      res.send(result);
    })
    // GET---------------------------
    app.get('/art', async (req, res) => {
      const cursor = artCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    // GET based on email-----------------------
    app.get('/art/:email', async (req, res) => {
      const mail = req.params.email;
      // console.log(mail);
      const query = { email: mail };
      const cursor = artCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })
    // PUT ---------------------------------------
    app.put('/art/:id', async (req, res) => {
      const crafts = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCrafts = {
        $set: {
          image: crafts.image,
          item_name: crafts.item_name,
          subcategory_name: crafts.subcategory_name,
          short_description: crafts.short_description,
          price: crafts.price,
          rating: crafts.rating,
          customization: crafts.customization,
          processing_time: crafts.processing_time,
          stock_status: crafts.stock_status,
          email: crafts.email,
          name: crafts.name
        }
      };
      const result = await artCollection.updateOne(filter, updatedCrafts, options);
      res.send(result);
    })
    // DELETE---------------------------------------------------
    app.delete('/art/:id', async (req, res) => {
      const id = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await artCollection.deleteOne(query);
      res.send(result);
    })
    // GET for SubCat-----------------------
    app.get('/sub', async (req, res) => {
      const cursor = subCatCollection.find();
      const result = await cursor.toArray();
      res.send(result);
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
  res.send("Art and Craft server is running");
})

app.listen(port, () => {
  console.log(`Art and Craft Server is running on port: ${port}`)
})