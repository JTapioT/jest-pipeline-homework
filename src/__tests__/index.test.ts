
import { app } from '../app';
import supertest from "supertest"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const request = supertest(app)

describe("Testing the testing environment", () => {
    it("should check that true is true", () => {
        expect(true).toBe(true);
    });
})

describe("Testing the app endpoints", () => {

    beforeAll(done => {
        console.log("This gets run before all tests in this suite")
        mongoose.connect(process.env.MONGO_URL_TEST!).then(() => {
            console.log("Connected to the test database")
            done();
        })
    })


    it("should check that the GET /test endpoint returns a success message", async () => {
        const response = await request.get("/test");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Test successful");
    })

    const validProduct = {
        name: "Test Product",
        price: 200,
    } 

    it("should check that the POST /products endpoint creates a new product", async () => {
        const response = await request.post("/products").send(validProduct)

        expect(response.status).toBe(201);
        expect(response.body._id).toBeDefined();
        expect(response.body.name).toBeDefined();
        expect(response.body.price).toBeDefined();

    })

    it("should check that the GET /products endpoint returns a list of products", async () => {
        const response = await request.get("/products");

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    })


    it("should return 404 with non-existing product id", async () => {
        // 600 should definitely not be a valid id..
        const response = await request.get("/products/600");
        expect(response.status).toBe(404);
    });

    it("should return correct product with a valid id", async () => {
        const productsResponse = await request.get("/products");
        const productId:string = productsResponse.body[0]._id
        const response = await request.get(`/products/${productId}`);

        expect(response.status).toBe(200);
        expect(response.body._id).toBeDefined();
        expect(response.body.name).toBeDefined();
        expect(response.body.price).toBeDefined();
        expect(response.body._id).toBe(productId);
        expect(response.body.name).toBe("Test Product");
        expect(response.body.price).toBe(200);
    });

    it("should accept PUT request when updating", () => {
        expect(request.put).toBeDefined()
    });

    it("should return 404 with a non-existing product id to update", async () => {
        // I guess id check already fails and therefore no need for a body within a request.
        const response = await request.put("/products/600"); 
        expect(response.status).toBe(404);
    });

    it("should return updated product", async () => {
        const productsResponse = await request.get("/products");
        const productId = productsResponse.body[0]._id;

        const updatedProduct = {
            name: "Test Product Updated",
            price: 1000,
        }; 
        const response = await request
            .put(`/products/${productId}`)
            .send(updatedProduct);
            
        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Test Product Updated");
        expect(response.body.price).toBe(1000);
    });


    it("should return status code 204 when deleting a product", async () => {
        const productsResponse = await request.get("/products");
        const productId = productsResponse.body[0]._id;

        const response = await request.delete(`/products/${productId}`);
        expect(response.status).toBe(204);
    });
    
    it("should return 404 when trying to delete product with non-existing id", async () => {
        const response = await request.delete("/products/600");
        expect(response.status).toBe(404);
    });


    afterAll(done => {
        mongoose.connection.dropDatabase()
            .then(() => {
                return mongoose.connection.close()
            })
            .then(() => {
                done()
            })
    })

});