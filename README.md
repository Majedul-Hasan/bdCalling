# Gym Management System

## Project Overview

The Gym Class Scheduling and Membership Management System is designed to manage gym operations efficiently. The system defines three roles: Admin, Trainer, and Trainee, each with specific permissions. Admins are responsible for creating and managing trainers, scheduling classes, and assigning trainers to these schedules. Each day can have a maximum of five class schedules, with each class lasting two hours. Trainers conduct the classes and can view their assigned class schedules but cannot create new schedules or manage trainee profiles. Trainees can create and manage their own profiles and book class schedules if there is availability, with a maximum of ten trainees per schedule.

---

---

## Technology Stack for back end


- **Backend**: 
  - JavaScript
  - Express.js
  - Mongoose (MongoDB ORM)
  - MongoDB
  - JWT (JSON Web Token) for authentication
- **API Documentation**: Postman
- **Environment Variables**: Dotenv

---

## API Endpoints

### Authentication

| Method | Endpoint           | Description                       | Parameters                      | Response                          |
|--------|--------------------|-----------------------------------|----------------------------------|-----------------------------------|
| POST   | `/api/auth/register`| Register a new user               | `name`, `email`, `password`,  | Success or error message          |
| POST   | `/api/auth/login`   | Log in a user (returns JWT)       | `email`, `password`              | JWT token or error message        |

---

### Trainer

| Method | Endpoint           | Description                       | Parameters                      | Response                          |
|--------|--------------------|-----------------------------------|----------------------------------|-----------------------------------|
| GET   | `/api/trainer/my-schedule`| This endpoint retrieves the schedule of classes for a specific trainer. It provides details about upcoming classes that the trainer is responsible for.              |   |  error message  OR     ``   "message": "Assigned class schedules retrieved successfully",``     |


---

### admin

| Method | Endpoint           | Description                       | Parameters                      | Response                          |
|--------|--------------------|-----------------------------------|----------------------------------|-----------------------------------|
| POST   | `/api/admin/create-trainer`| This endpoint allows admins to create a new trainer. The trainer's details are validated and stored in the database. | ``Bearer Token``  ``trainer info``   |  - 201 Created: The trainer has been successfully created. <br> 400 Bad Request: Validation errors (e.g., email already in use). |
| PUT   | `api/admin/update-trainer/66fe6d03f32fee30ce1cb60b`| This endpoint allows admins to update an existing trainer's details. | ``Bearer Token``  ``trainer info``   |  ``200 OK``: The trainer has been successfully updated. <br>`404 Not Found`: Trainer with the specified ID does not exist. |
| DELETE   | `/api/admin/delete-trainer/<deleteID>?newTrainerId=<newTrainerId`| This endpoint allows admins to create a new class schedule, assigning it to a specific trainer. | ``Bearer Token``  ``trainer info`` ``newTrainerId``    |  `201 Created`: The class has been successfully scheduled. <br>`400 Bad Request:` Validation errors (e.g., trainer not found).|
| POST   | `/api/admin/create-class-schedule`| This endpoint allows admins to create a new class schedule, assigning it to a specific trainer. | ``Bearer Token``  ``classDate info`` ``timeSlot``    | `success massage`  |

---

### admin

| Method | Endpoint           | Description                       | Parameters                      | Response                          |
|--------|--------------------|-----------------------------------|----------------------------------|-----------------------------------|
| POST   | `/api/trainee/book-class-schedule`| This endpoint allows trainees to book a class schedule by providing the class ID. | ``Bearer Token``  ``classId``   |  `201 Created`: The class has been successfully booked. <br>` 400 Bad Request:` Validation errors (e.g., class not found, already booked). |
| PUT   | `/api/trainee/update-my-profile`| This endpoint allows trainees to update their profile information, including their phone number, name, and avatar. | ``Bearer Token``  ``phone, name , avatar``   | `` 200 OK: `` Profile updated successfully. <br> `400 Bad Request`    |
| POST   | `/api/trainee/cancel-class-schedule`| This endpoint allows trainees to cancel a previously booked class schedule by providing the class ID. | ``Bearer Token``  ``classId``    |  `200 OK`: The class has been successfully canceled. <br> `404 Not Found`: Class not found or not booked by the trainee.|
| GET   | `/api/trainee/my-class`| This endpoint retrieves the list of classes booked by the trainee. | ``Bearer Token``  | `200 OK`:Successfully retrieved the list of classes. <br> `404 Not Found:` No classes found. |
| GET   | `/api/trainee/my-profile`| This endpoint retrieves the profile information of the logged-in trainee. | ``Bearer Token``  | `200 OK`: Successfully retrieved the profile information. <br> ``404 Not Found:`` Profile not found. |

---

## Database relation



---

## Instructions to Run Locally

### Prerequisites

- **Node.js** installed (v18 or later)
- **MongoDB** to run mongoDB locally make sure mongo server is install in your local machine. if your machine does have mongo installed then you can download and install from [here](https://www.mongodb.com/try/download/community) else if you don't like to run mongo server locally you can go for [mongoDb atlas](https://cloud.mongodb.com). 
- **Git** If you have installed git in your machine then follow the step by step guide OR if you don't have git installed then you can download and install from [here](https://git-scm.com/downloads). You can ignore git installed then skip guide 1 

### Step-by-step Guide

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Majedul-Hasan/bdCalling.git
    cd bdCalling
    ```

- ###### **download the code:** (optional)
  - find green colored  Code button
  - click on it
  - Download ZIP
  - extract
   follow process from step 2   

   

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

   rename `.envexample` to `.env` in the root directory provide the values:

    ```
    MONGODB_CONNECTION_STRING = your_MONGO_URI
   JWT_SECRET = your_secret_key
    PORT=5001
    ```

4. **Run the server:**

    ```bash
    npm start
    ```

5. **Access the app:**

   Open [http://localhost:5001](http://localhost:5001) in your browser.

### Postman API Docs

Access the API documentation at [api docs](https://documenter.getpostman.com/view/13802837/2sAXxMeYeH#3e307bff-108c-4bce-8095-ddfebebed0ce) . 

---

## Live Hosting Link

Live Link   [LIVE LINK](https://bdcallinggym.vercel.app/)

---

### Database Schema

**User.model.js**
```JavaScript
//User.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
      unique: true,
    },
    phone: {
      required: false,
      type: String,
    },

    role: {
      type: String,
      enum: ['admin', 'trainer', 'trainee'],
      default: 'user',
      required: true,
    },
    profilePicture: {
      required: false,
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User ?? mongoose.model('User', userSchema);

module.exports = User;

 ```

---
**ClassSchedule.module.js**

```JavaScript 
//ClassSchedule.module.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the available time slots for the classes
const availableTimeSlots = [
  '08:15 AM - 10:15 AM',
  '10:30 AM - 12:30 PM',
  '01:30 PM - 03:30 PM', // 60-minute lunch break
  '03:45 PM - 05:45 PM',
  '06:00 PM - 08:00 PM',
];

// Class Schedule Schema
const classScheduleSchema = new Schema({
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true,
  },
  trainees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  classDate: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    enum: availableTimeSlots, // Restrict to predefined time slots
    required: true,
  },
  maxTrainees: {
    type: Number,
    default: 10, // Maximum of 10 trainees per class
  },
});

module.exports = mongoose.model('ClassSchedule', classScheduleSchema); 
```

---

**Trainer.model.js**
```javascript 
// Trainer.model.js
const mongoose = require('mongoose');
const User = require('./User.model');
const { Schema } = mongoose;

// Trainer Schema (inherits from User)
const trainerSchema = new Schema({
  expertise: {
    type: String,
    required: true,
  },
  certifications: [
    {
      type: String,
      required: false,
    },
  ],
  yearsOfExperience: {
    type: Number,
    required: true,
  },
  availableDays: {
    type: [String],
  },
});

const Trainer = User.discriminator('Trainer', trainerSchema);

module.exports = Trainer;

```
---



### Key Features to Test

- **Create Trainers**: Log in as an admin and create new trainers using the `/api/admin/create-trainer` endpoint. 

input formate

   ```JSON
    {
   "name": "majedul hasan",
   "email": "test123@gmail.com",
   "password": "123456", 
   "phone":"01234578966" ,
   "expertise": "fitness",
    "certifications": ["Certified Yoga Instructor"],
     "yearsOfExperience": 5,
  "availableDays": ["Monday", "Wednesday", "Friday"]
}
```



- **Schedule Classes**: Log in as an admin and create new classes using the `/api/admin/create-class-schedule` endpoint.
- **Booking Classes**: Log in as a member, browse available classes, and book one using the `/api/trainee/book-class-schedule` endpoint.