import mongoose from "mongoose"
import IProducts from "../types/IProducts";

export const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
}, { timestamps: true })
