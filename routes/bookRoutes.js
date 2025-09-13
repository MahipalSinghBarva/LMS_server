const express = require("express");
const bookRouter = express.Router();
const { Book } = require("../models/models.js");
const quizmiddle = require("../middleware/middleware.js");


bookRouter.post(
    "/add-book",
    quizmiddle("BookAdmin", "manager", "admin"),
    async (req, res) => {
        try {
            const { name, authorName, status } = req.body;

            if (!name || !authorName || !status) {
                return res.status(400).json({
                    message: "All fields are required (name, authorName, status)",
                });
            }

            const book = new Book({ name, authorName, status });
            await book.save();

            res.status(201).json({
                message: "✅ Book added successfully",
                book,
            });
        } catch (err) {
            console.error("❌ Error adding book:", err);
            res.status(500).json({
                message: "Internal server error while adding book",
            });
        }
    }
);

bookRouter.get("/", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

bookRouter.get("/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found" });
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


bookRouter.put("/:id", quizmiddle("BookAdmin", "manager", "admin"), async (req, res) => {
    try {
        const { name, authorName, status } = req.body;
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { name, authorName, status },
            { new: true, runValidators: true }
        );

        if (!updatedBook) return res.status(404).json({ message: "Book not found" });

        res.json({
            message: "✅ Book updated successfully",
            updatedBook,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

bookRouter.delete("/:id", quizmiddle("BookAdmin", "manager", "admin"), async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) return res.status(404).json({ message: "Book not found" });

        res.json({ message: "✅ Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = bookRouter;
