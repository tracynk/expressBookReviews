const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const findAuthor = (author)=>{
    for (let key in books) {
        if (books[key].author === author) {
            return key;
        }
    }
}

const findTitle = (title)=>{
    for (let key in books) {
        if (books[key].title === title) {
            return key;
        }
    }
}

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered"});
    } else {
      return res.status(404).json({message: "This user already exists"});    
    }
  } 
  return res.status(404).json({message: "Password and/or username not provided"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  /*
  return res.status(300).send(JSON.stringify({"books": books},null,4));
  */
  const book_list = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify({books}, null, 4)));
  });

  book_list.then(() => {
    console.log("Successfully outputed list");
  })

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const book_isbn = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    resolve(res.send(JSON.stringify(books[isbn],null,4)));
  });

  book_isbn.then(() => {
    console.log("Successfully retrieved book by ISBN");
  })

  //return res.status(300).send(JSON.stringify(books[isbn],null,4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const book_author = new Promise((resolve, reject) => {
        const author = req.params.author;
        const isbn = findAuthor(author);
        if(isbn){
            let bookDetails = {
                "isbn": isbn,
                "title": books[isbn].title,
                "reviews": books[isbn].reviews
              }  
            resolve(res.send(JSON.stringify({"book details": bookDetails},null,4)));
        } else {
            reject(res.send("The author does not exist "))
        }
    });
    book_author.then(function(){
        console.log("Author is found");
    }).catch(function () { 
        console.log('The author does not exist');
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const book_title = new Promise((resolve, reject) => {
    const title = req.params.title;
    const isbn = findTitle(title);
    if(isbn){
        let bookDetails = {
            "isbn": isbn,
            "author": books[isbn].author,
            "reviews": books[isbn].reviews
          }
        resolve(res.send(JSON.stringify({"book details": bookDetails},null,4)));
    } else {
        reject(res.send("The title does not exist "))
    }
    });
    book_title.then(function(){
        console.log("Book title is found");
    }).catch(function () { 
        console.log('The title does not exist');
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(300).send(JSON.stringify(books[isbn].reviews,null,4));
});

module.exports.general = public_users;
