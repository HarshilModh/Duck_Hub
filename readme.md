Installation :

1. Clone the repository to tout local machine using the command
   https://github.com/HarshilModh/Duck_Hub.git

2. Install the dependencies needed for the project
   npm install

3. Load seed data
   npm run seed

4. Start the application
   npm start

Once the server is running, it listens on PORT: 3000 by default.

Accessing the Application :

1. Project URL : http://localhost:3000/

2. Navigate to http://localhost:3000/users/signup to create a new account.

3. Navigate to http://localhost:3000/users/login to login to an existing account.

Database :

1. A MongoDB database named duck_Hub is created automatically (on localhost:27017) when you run the seed script.

2. Open MongoDB Compass and connect to mongodb://localhost:27017/duck_Hub

Default Users :

1. On loading the seed data, two accounts are automatically created for testing.

a. Username (alice@example.com) || Password (Password123!) || Role (ADMIN)
b. Username (bob@example.com) || Password (Secret456!) || Role (USER)

- Please create an account with your own email to test the OTP email functionality.

- OTP can come sometimes land in your spam or junk folder so please check that.

Missing Features :

The following features have been excluded after discussing with the professor.
1. Excluded
- Admin can create accounts for users if needed. (Excluded)
2. Changed a little 
- When a user attempts to create a new tag on the Academic Resources page, display an alert explaining that tag creation isn’t allowed there.

what he have changed:

- Do not render the “Create Tag” button at all on the Academic Resources page, so users never have the option to initiate tag creation.
