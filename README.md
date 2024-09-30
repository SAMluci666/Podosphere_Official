# Podoshphere_Official

## Description
Podosphere is an alumni-connect platform designed to help former students stay connected with their alma mater. The platform allows users to submit contact forms and subscribe to newsletters.

## Table of Contents
1. [Description](#description)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
5. [Usage](#usage)
6. [API Endpoints](#api-endpoints)
7. [Environment Variables](#environment-variables)
8. [Contributing](#contributing)
9. [License](#license)

## Features
- Alumni contact submission form.
- Newsletter subscription system.
- MongoDB integration for storing user data.
- Scalable backend using Node.js and Express.

## Technologies Used
- Node.js
- Express.js
- MongoDB (with Mongoose)
- Bootstrap

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (or MongoDB Atlas for cloud database)

### Installation Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/username/project-name.git
   cd project-name
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   MONGODB_URI=<Your MongoDB Connection String>
   PORT=3000
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   The server will start on `http://localhost:3000`.

## Usage

### Running Locally
- Go to http://localhost:3000 in your browser.
- Submit the contact form or subscribe to the newsletter.

### API Endpoints

- **POST /contact**
  - Description: Submits a contact form.
  - Payload:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "message": "Hello!"
    }
    ```

- **POST /newsletter**
  - Description: Subscribes an email to the newsletter.
  - Payload:
    ```json
    {
      "email": "john@example.com"
    }
    ```

## Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Port the server runs on (default is 3000)

## Contributing
Contributions are welcome! Please follow the steps below:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a pull request.

## License
MIT License
```

---
