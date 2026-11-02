
const express = require('express');

const app = express();

const PORT = 3000;

// Middleware
app.use(express.json());

// In-memory array
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

// 1. POST - Add a new book
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


// 2. GET - Get all books
app.get('/api/books', (req, res) => {

    res.status(200).json(books);

});


// 3. GET - Get book by ID
app.get('/api/books/:id', (req, res) => {

    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);

});


// 4. PUT - Update book
app.put('/api/books/:id', (req, res) => {

    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, genre, totalCopies } = req.body;

    if (title !== undefined) {
        if (typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({ message: "Invalid title" });
        }
        book.title = title;
    }

    if (author !== undefined) {
        if (typeof author !== 'string' || !author.trim()) {
            return res.status(400).json({ message: "Invalid author" });
        }
        book.author = author;
    }

    if (genre !== undefined) {
        if (typeof genre !== 'string' || !genre.trim()) {
            return res.status(400).json({ message: "Invalid genre" });
        }
        book.genre = genre;
    }

    if (totalCopies !== undefined) {

        const issuedCopies = book.totalCopies - book.availableCopies;

        if (!Number.isInteger(totalCopies) ||
            totalCopies < 1 ||
            totalCopies < issuedCopies) {

            return res.status(400).json({
                message: "Invalid total copies"
            });
        }

        book.totalCopies = totalCopies;
        book.availableCopies = totalCopies - issuedCopies;
    }

    res.status(200).json({
        message: "Book updated successfully",
        book
    });

});


// 5. DELETE - Delete book
app.delete('/api/books/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (books[index].availableCopies !== books[index].totalCopies) {
        return res.status(400).json({
            message: "Cannot delete a book with issued copies"
        });
    }

    books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully"
    });

});


// 6. GET - Search books
app.get('/api/books/search', (req, res) => {

    const search = req.query.q;

    if (!search || !search.trim()) {
        return res.status(400).json({
            message: "Please provide a search keyword"
        });
    }

    const result = books.filter(book =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase()) ||
        book.genre.toLowerCase().includes(search.toLowerCase())
    );

    res.status(200).json(result);

});


// 7. POST - Issue a book
app.post('/api/books/:id/issue', (req, res) => {

    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (book.availableCopies <= 0) {
        return res.status(400).json({
            message: "Book is not available"
        });
    }

    book.availableCopies--;

    res.status(200).json({
        message: "Book issued successfully",
        book
    });

});


// 8. POST - Return a book
app.post('/api/books/:id/return', (req, res) => {

    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (book.availableCopies >= book.totalCopies) {
        return res.status(400).json({
            message: "No issued copy to return"
        });
    }

    book.availableCopies++;

    res.status(200).json({
        message: "Book returned successfully",
        book
    });

});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
