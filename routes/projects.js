const express = require("express");
const Project = require("../models/project");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/",
  upload.single("image"),
  async (req, res, next) => {
    req.project = new Project();
    next();
  },
  saveProjectAndRedirect("new")
);

router.get("/new", (req, res) => {
  res.render("projects/new", { project: new Project() });
});

router.get("/:slug", async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug });
  console.log(project);
  if (project == null) res.redirect("/");
  res.render("projects/show", { project: project });
});

router.get("/edit/:id", async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.render("projects/edit", { project: project });
});

router.put(
  "/:id",
  async (req, res, next) => {
    req.project = await Project.findById(req.params.id);
    next();
  },
  saveProjectAndRedirect("edit")
);

router.delete("/:id", async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

function saveProjectAndRedirect(path) {
  return async (req, res) => {
    console.log(req.file);
    let project = req.project;
    project.title = req.body.title;
    project.youtube = req.body.youtube;
    project.image = req.file.originalname;
    project.github = req.body.github;
    project.description = req.body.description;
    try {
      project = await project.save();
      res.redirect(`/projects/${project.slug}`);
    } catch (e) {
      res.render(`projects/${path}`, { project: project });
    }
  };
}

module.exports = router;
