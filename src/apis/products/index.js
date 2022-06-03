import express from "express";
import {
  getProducts,
  writeProducts,
  getReviews,
  writeReviews,
  getProductsReadableStream,
} from "../../lib/fs-tools.js";
import createError from "http-errors";
import ProductModel from "./model.js";
import q2m from "query-to-mongo";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const productsRouter = express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary, // this searches in your process.env for something called CLOUDINARY_URL, which contains your API environment variable
    params: {
      folder: "m6d10",
    },
  }),
  fileFilter: (req, file, multerNext) => {
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      multerNext(createError(400, "Only PNG or JPEG allowed!"));
    } else {
      multerNext(null, true);
    }
  },
  limits: { fileSize: 1 * 1024 * 1024 },
}).single("picture");

productsRouter.post(
  "/:productId/upload",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const products = await ProductModel.findByIdAndUpdate(
        req.params.productId,
        { imageUrl: req.file.path },
        { new: true, runValidators: true }
      );

      console.log("FILE: ", req.file);

      res.send();
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
      /* next(error); */
    }
  }
);

productsRouter.post("/", async (req, res, next) => {
  try {
    const newProduct = new ProductModel(req.body);
    const { _id } = await newProduct.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/", async (req, res, next) => {
  try {
    console.log("QUERY: ", req.query);
    console.log("MONGO-QUERY: ", q2m(req.query));
    const mongoQuery = q2m(req.query);
    const total = await ProductModel.countDocuments(mongoQuery.criteria);
    const Products = await ProductModel.find(
      mongoQuery.criteria,
      mongoQuery.options.fields
    )
      .skip(mongoQuery.options.skip)
      .limit(mongoQuery.options.limit)
      .sort(mongoQuery.options.sort)
      .populate({ path: "reviews", select: "comment text" });
    res.send({
      links: mongoQuery.links("http://localhost:3001/products", total),
      total,
      totalPages: Math.ceil(total / mongoQuery.options.limit),
      Products,
    });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductModel.findById(
      req.params.productId
    ); /* .populate({
      path: "authors",
      select: "firstName lastName",
    }) */
    if (product) {
      res.send(product);
    } else {
      next(
        createError(404, `Product with id ${req.params.productId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedProduct) {
      res.send(updatedProduct);
    } else {
      next(
        createError(404, `Product with id ${req.params.productId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(
      req.params.productId
    );
    if (deletedProduct) {
      res.status(204).send();
    } else {
      next(
        createError(404, `Product with id ${req.params.productId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
