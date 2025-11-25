# Duck Hub 🦆

Duck Hub is a comprehensive campus community platform designed to connect students and streamline access to university resources. It serves as a central hub for academic materials, course reviews, campus discussions, and real-time polling.

https://duck-hub.onrender.com/forums

## ✨ Features

* **💬 Community Forums**: Engage in discussions with rich text, image uploads, and tagging.
* **📚 Academic Resources**: Shared repository for study materials.
* **🏫 Campus Guide**: Directory of campus locations with operating hours and maps.
* **⭐ Course Reviews**: Peer-driven review system for university courses.
* **📊 Polls**: Interactive student opinion polls.
* **🔐 Secure Authentication**: Local and Google OAuth 2.0 login with OTP verification.

## 🛠️ Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: MongoDB (Mongoose)
* **Templating**: Handlebars
* **Auth**: Passport.js (Google Strategy), BCrypt
* **Storage**: Cloudinary

---

## 🚀 Installation

1.  Clone the repository to your local machine using the command:
    ```bash
    git clone [https://github.com/HarshilModh/Duck_Hub.git](https://github.com/HarshilModh/Duck_Hub.git)
    ```

2.  Install the dependencies needed for the project:
    ```bash
    npm install
    ```

3.  Load seed data:
    ```bash
    npm run seed
    ```

4.  Start the application:
    ```bash
    npm start
    ```

Once the server is running, it listens on **PORT: 3000** by default.

## 🌐 Accessing the Application

1.  **Project URL**: [http://localhost:3000/](http://localhost:3000/)
2.  Navigate to `http://localhost:3000/users/signup` to create a new account.
3.  Navigate to `http://localhost:3000/users/login` to login to an existing account.

## 🗄️ Database

1.  A MongoDB database named `duck_Hub` is created automatically (on `localhost:27017`) when you run the seed script.
2.  Open MongoDB Compass and connect to:
    ```
    mongodb://localhost:27017/duck_Hub
    ```

## 🧪 Default Users

On loading the seed data, two accounts are automatically created for testing:

| Role | Username (Email) | Password |
| :--- | :--- | :--- |
| **ADMIN** | `alice@example.com` | `Password123!` |
| **USER** | `bob@example.com` | `Secret456!` |

> **Note:** Please create an account with your own email to test the OTP email functionality. OTP can sometimes land in your spam or junk folder, so please check that.

## ⚠️ Missing / Changed Features

The following features have been excluded or modified after discussing with the professor:

1.  **Excluded**:
    * Admin can create accounts for users if needed.

2.  **Changed**:
    * *Original Requirement*: When a user attempts to create a new tag on the Academic Resources page, display an alert explaining that tag creation isn’t allowed there.
    * *Current Implementation*: Do not render the “Create Tag” button at all on the Academic Resources page, so users never have the option to initiate tag creation.

## 🔑 Environment Variables

If you want access to the `.env` file, please mail us at:
* `vkovvuri@stevens.edu`
* `hmodh@stevens.edu`

---

<p align="center">
  Built with 🦆 for the Campus Community
</p>
