const express = require('express')
const mongoose = require("mongoose")
const mongoURL = `mongodb+srv://abrar:3NUfKV42ivL3fxNm@cluster0.ekd31bu.mongodb.net/admin1?retryWrites=true&w=majority`

const app = express()
const cors = require('cors')
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
const port = 8000;

//  create schema for mongodb atlas 

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cretedAt: {
        type: Date,
        default: Date.now
    }
})

//   create modal
const Product = mongoose.model("Products", productSchema)


//  connect database 

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURL)
        console.log("Databse is Connected")
    } catch (error) {
        console.log("db not connected ", error)
        process.exit(1)
    }
}




app.listen(port, async () => {
    console.log(`server is running at http://localhost:${port}`)
    await connectDB()
})

//  send request from server 

app.get("/", (req, res) => {
    res.send("welcome to home page")
})

app.post("/products", async (req, res) => {
    try {
        //  get  data from databasae body
        const title = req.body.title;
        const price = req.body.price;
        const description = req.body.description

        const newProduct = new Product({
            title: title,
            price: price,
            description: description,
        })

        const productData = await newProduct.save()
        res.status(201).send(productData)


    } catch (error) {
        res.status(5000).send({ massage: error.message })
    }
})

//  read method handler 

app.get("/products", async (req, res) => {
    // comparisone oparation from query paramiters
    try {
        const price = req.query.price;
        let products;
        if (price) {
            products = await Product.find({ price: { $gt: price } }) // dynamic query  value  from  clients
        } else {
            products = await Product.find()
        }
        if (products) {
            res.status(200).send({
                success: true,
                messege: "return single product ",
                data: products
            })
        } else {
            success: false,
                res.status(404).send({ massage: "products not found" })
        }
    } catch (error) {
        res.status(404).send({ messege: error.messege })
    }
})

//  data find by id  from database 
app.get("/products/:id", async (req, res) => {
    try {
        const id = req.params.id;
        // find on modal name => modal name id Product  
        const product = await Product.findOne({ _id: id })
        if (product) {
            res.status(200).send({
                success: true,
                messege: "return single product ",
                data: product
            })
        } else {
            success: false,
                res.status(404).send({ massage: "product not found" })
        }
    } catch (error) {
        res.status(404).send({ messege: error.messege })
    }
})

//  update products 

app.put('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;          // updateOne => dosent return updated product 
        const updatedProduct = await Product.findByIdAndUpdate({ _id: id }, {
            // $set: {
            //     price: 2,
            // },

              $set: {
                 title : req.body.title,
                 price: req.body.price,
                 description : req.body.description
            },

        }, {new : true}); // exact response send to postman 
        if (updatedProduct) {
            res.status(200).send({
                success: true,
                messege: "updated single product ",
                data: updatedProduct
            })
        } else {
            success: false,
                res.status(404).send({ massage: "product not found" })
        }
    } catch (error) {
        console.log(error)
    }
})



//  DATABASE => collection => documents

//  method
//  POST : /products =>  create a products
//  GET: /products => return all the products
//  GET: /products/id => return specefic products basesd on id
//   PUT/ UPDATE: /products  => Update a produts
// DELETE : /prducts/id  =>   deleete  products specefic id 

