const mongoose = require("mongoose");
const slugify = require("slugify");

const projectSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  image: {
    // required: true,
    data: Buffer,
    type: String,
  },
  youtube: {
    required: true,
    type: String,
  },
  github: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  slug: {
    required: true,
    type: String,
    unique: true,
  },
});

projectSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Project", projectSchema);
