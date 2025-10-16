import express from "express";
import { Sequelize, DataTypes } from "sequelize";
import multer from "multer";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// --- Sequelize MySQL setup ---
const sequelize = new Sequelize("nature_gallery", "root", "123517", {
  host: "localhost",
  dialect: "mysql",
  logging: console.log, // optional: logs all SQL queries
});

// --- Models ---
const Image = sequelize.define("Image", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING(600), allowNull: false },
  imageUrl: { type: DataTypes.STRING, allowNull: false },
  likes: { type: DataTypes.INTEGER, defaultValue: 0 },
});

const Comment = sequelize.define("Comment", {
  text: { type: DataTypes.STRING, allowNull: false },
  timestamp: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
});

Image.hasMany(Comment, { onDelete: "CASCADE" });
Comment.belongsTo(Image);

// --- Multer setup ---
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// --- Routes ---

// Upload image (no AI validation)
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { name, email, description } = req.body;
    if (!name || !email || !description || !req.file) {
      return res.status(400).json({ error: "Please fill all fields and select an image." });
    }

    const image = await Image.create({
      name,
      email,
      description,
      imageUrl: `/uploads/${req.file.filename}`,
    });

    res.json(image);
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Upload failed." });
  }
});

// Get all images
app.get("/images", async (req, res) => {
  try {
    const images = await Image.findAll({
      include: Comment,
      order: [["createdAt", "DESC"]],
    });
    res.json(images);
  } catch (err) {
    console.error("Failed to fetch images:", err);
    res.status(500).json({ error: "Failed to fetch images." });
  }
});

// Like an image
app.post("/images/:id/like", async (req, res) => {
  try {
    const image = await Image.findByPk(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    image.likes += 1;
    await image.save();
    res.json({ likes: image.likes });
  } catch (err) {
    console.error("Failed to like image:", err);
    res.status(500).json({ error: "Failed to like image." });
  }
});

// Comment on an image
app.post("/images/:id/comment", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Comment text is required." });

    const image = await Image.findByPk(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    await Comment.create({ text, timestamp: new Date(), ImageId: image.id });

    const comments = await Comment.findAll({ where: { ImageId: image.id } });
    res.json(comments);
  } catch (err) {
    console.error("Failed to comment:", err);
    res.status(500).json({ error: "Failed to comment." });
  }
});

// --- Start server ---
const startServer = async () => {
  try {
    await sequelize.sync();
    console.log("Database synced!");
    app.listen(3001, () => console.log("Server running on http://localhost:3001"));
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();
