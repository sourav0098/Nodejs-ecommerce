const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueSlug = require("unique-slug");

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
    },
    images: {
      type: Array,
    },
    color: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    live: {
      type: Boolean,
      default: true,
    },
    reviews: [
      {
        rating: { type: Number, required: true },
        review: { type: String, required: true },
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving the document
productSchema.pre("save", async function (next) {
  if (!this.isModified("title")) {
    return next();
  }

  const slug = slugify(this.title, { lower: true, replacement: "-" });

  try {
    // Check if the generated slug is unique
    const slugExists = await this.constructor.exists({ slug });

    if (slugExists) {
      // If slug already exists, append a random string to make it unique
      const uniqueSuffix = uniqueSlug();
      this.slug = `${slug}-${uniqueSuffix}`;
    } else {
      this.slug = slug;
    }

    next();
  } catch (error) {
    next(error);
  }
});
//Export the model
module.exports = mongoose.model("Product", productSchema);
