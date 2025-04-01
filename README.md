# 📚 Book Management API  

A **Node.js & Express.js** backend for managing books, users, and reviews. It includes authentication, authorization, and CRUD operations for books and reviews.  

## 🚀 Features  
✅ **User Authentication**: Signup & Login using JWT.  
✅ **Book Management**: Create, Update, Delete, and Fetch books.  
✅ **Review System**: Add, Edit, and Delete reviews for books.  
✅ **Role-based Access**: Admin control for book management.  
✅ **Secure & Scalable**: Uses bcrypt, JWT, and cookie-parser.  

---

## 🛠️ Tech Stack  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB, Mongoose  
- **Security**: JWT, bcrypt, cookie-parser  
- **Deployment**: Render, MongoDB Atlas  

---

## 📌 Installation & Setup  

### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/Lokesh-Bijarniya/Book-Management
cd server

### 2️⃣ Install Dependencies
```sh
npm install

### 3️⃣ Set Up Environment Variables
```sh
PORT=8001  
MONGO_URL=your_mongo_connection_string  
JWT_SECRET=your_secret_key  

### 4️⃣ Run the Server
```sh
npm start


## 📁 API Endpoints  

### 🔹 User Routes (`/api/auth`)  
- **POST** `/signup` – Register a new user  
- **POST** `/signin` – Login and get JWT  

### 🔹 Book Routes (`/api/book`)  
- **POST** `/createBook` – Create a book (Admin only)  
- **GET** `/getBooks` – Fetch all books  
- **GET** `/getBook/:bookId` – Fetch a single book  
- **PUT** `/updateBook/:bookId` – Update a book (Admin only)  
- **DELETE** `/deleteBook/:bookId` – Delete a book (Admin only)  

### 🔹 Review Routes (`/api/book/:bookId/review`)  
- **POST** `/create-review` – Add a review  
- **PUT** `/:reviewId` – Update a review  
- **DELETE** `/:reviewId` – Delete a review  

---

## 🔒 Security Measures  
✔ **JWT Authentication** for secure API access  
✔ **Password Hashing** using bcrypt  
✔ **Role-based Authorization** for restricted access  

---

## 📌 License  
This project is **MIT Licensed**.  

> **Maintained by:** Lokesh Bijarniya  





