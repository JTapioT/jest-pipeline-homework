import express from "express"
import { ProductModel } from "./model.js"

const productsRouter = express.Router()

productsRouter
    .get('/', async (req, res) => {
        const products = await ProductModel.find({})
        res.send(products)
    })
    .post("/", async (req, res) => {
        const product = new ProductModel(req.body)
        await product.save()
        res.status(201).send(product)
    })
    .get("/:id", async (req,res) => {
        try {
            const product = await ProductModel.findById(req.params.id);
            if(product) {
                res.send(product)
            }
        } catch (error) {
            //console.log(error);
            res.status(404).send();
        }
    })
    .put("/:id", async (req,res) => {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                {new: true}
            )

            if(updatedProduct) {
                res.send(updatedProduct);
            }
        } catch (error) {
            console.log(error);
            res.status(404).send();
        }
    })
    .delete("/:id", async (req,res) => {
        try {
            const productToDelete = await ProductModel.findByIdAndDelete(req.params.id);
            if(productToDelete) {
                res.status(204).send();
            } 
        } catch (error) {
            //console.log(error);
            res.status(404).send();
        }
    })

export default productsRouter