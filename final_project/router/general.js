// general.js
const express = require('express');
const axios = require('axios');
const books = require("./booksdb.js");
const public_users = express.Router();

// Route to get the list of books available in the shop using async-await with Axios
public_users.get('/', async (req, res) => {
    try {
        // Fetch the list of books from the server using Axios
        const response = await axios.get('http://localhost:5000/books');
        // Send the fetched books as JSON response
        res.json(response.data);
    } catch (error) {
        // If there's an error fetching the books, send an error response
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

// Additional route handlers are defined here

module.exports.general = public_users;


// Route to get book details based on author using async-await with Axios
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
      // Fetch the book details from the server using Axios
      const response = await axios.get(`http://localhost:5000/books/author/${author}`);
      // Send the fetched book details as JSON response
      res.json(response.data);
  } catch (error) {
      // If there's an error fetching the book details, send an error response
      console.error('Error fetching book details:', error);
      res.status(500).json({ error: 'Failed to fetch book details' });
  }
});

// Route to get book details based on ISBN
// Route to get book details based on ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
      // Fetch the book details from the server using Axios
      const response = await axios.get(`http://localhost:5000/books/${isbn}`);
      // Send the fetched book details as JSON response
      res.json(response.data);
  } catch (error) {
      // If there's an error fetching the book details, send an error response
      console.error('Error fetching book details:', error);
      res.status(500).json({ error: 'Failed to fetch book details' });
  }
});

// Route to get book details based on title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
      // Fetch the book details from the server using Axios
      const response = await axios.get(`http://localhost:5000/books/title/${title}`);
      // Send the fetched book details as JSON response
      res.json(response.data);
  } catch (error) {
      // If there's an error fetching the book details, send an error response
      console.error('Error fetching book details:', error);
      res.status(500).json({ error: 'Failed to fetch book details' });
  }
});
// Route to get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books.hasOwnProperty(isbn)) {
        const bookReviews = books[isbn].reviews;
        return res.json(bookReviews);
    } else {
        return res.status(404).json({ error: "Book not found" });
    }
});

module.exports.general = public_users;
