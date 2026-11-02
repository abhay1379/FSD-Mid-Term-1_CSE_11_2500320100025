const express = require('express');

const app = express();

const PORT = 3000;

// Middleware
app.use(express.json());

let books = [
    {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Fiction",
        totalCopies: 5,
        availableCopies: 5
    },
    {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        genre: "Self Help",
        totalCopies: 3,
        availableCopies: 3
    }
];

app.post('/api/books', (req, res) => {

    const { title, author, genre, totalCopies } = req.body;

    if (!title || !author || !genre ||
        !Number.isInteger(totalCopies) || totalCopies <= 0) {

        return res.status(400).json({
            message: "Please provide valid book details"
        });
    }

    const newBook = {
        id: books.length > 0
            ? Math.max(...books.map(book => book.id)) + 1
            : 1,

        title,
        author,
        genre,
        totalCopies,
        availableCopies: totalCopies
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});