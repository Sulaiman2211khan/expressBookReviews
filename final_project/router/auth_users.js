// auth_users.js
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js"); 

const regd_users = express.Router();
let users = [];

const isValid = (username) => {
    return !!username; // Check if the username is not empty
}

const userExists = (username) => {
    return users.some(user => user.username === username);
}

const addUser = (username, password) => {
    users.push({ username, password });
}

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!isValid(username) || !isValid(password)) {
        return res.status(400).json({ error: "Invalid username or password" });
    }

    if (userExists(username)) {
        return res.status(409).json({ error: "User already exists" });
    }

    addUser(username, password);
    return res.status(201).json({ message: "User successfully registered. You can now login." });
});

regd_users.post("/login", (req, res, next) => { // Added 'next' parameter
    // Check if the 'authorization' property is defined in the request object
    if (req.session && req.session.authorization) {
        // Access the 'authorization' property if it's defined
        const token = req.session.authorization['accessToken'];
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  if (!isValid(isbn) || !isValid(review)) {
      return res.status(400).json({ error: "Invalid ISBN or review" });
  }

  const username = req.session.authorization.username;

  if (!isValid(username)) {
      return res.status(401).json({ error: "Unauthorized, please log in" });
  }

  if (!books.hasOwnProperty(isbn)) {
      return res.status(404).json({ error: "Book not found" });
  }

  if (!books[isbn].hasOwnProperty('reviews')) {
      books[isbn].reviews = [];
  }

  // Check if the user has already posted a review for the same ISBN
  const existingReviewIndex = books[isbn].reviews.findIndex(r => r.username === username);
  if (existingReviewIndex !== -1) {
      // If the user has already posted a review, modify the existing review
      books[isbn].reviews[existingReviewIndex].review = review;
      return res.json({ message: "Review modified successfully" });
  } else {
      // If the user has not posted a review yet, add a new review
      books[isbn].reviews.push({ username, review });
      return res.json({ message: "Review added successfully" });
  }
});

// DELETE a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username; // Assuming the username is stored in the session

  // Check if the book exists
  if (!books.hasOwnProperty(isbn)) {
      return res.status(404).json({ error: "Book not found" });
  }

  // Check if the user has previously reviewed the book
  if (!books[isbn].reviews.hasOwnProperty(username)) {
      return res.status(404).json({ error: "Review not found" });
  }

  // Delete the review associated with the session username
  delete books[isbn].reviews[username];

  // Send a success response
  return res.json({ message: "Review deleted successfully" });
});

module.exports = {
    authenticated: regd_users,
    isValid,
    users
};
