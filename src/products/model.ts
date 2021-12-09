import { ProductSchema } from "./schema";
import mongoose from "mongoose"
import IProducts from "../types/IProducts";

const ProductModel = mongoose.model<IProducts>("products", ProductSchema);

export default ProductModel;