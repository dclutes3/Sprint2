# Sprint2: Islanders
Billy Mears, Drew Clutes, Evan Dobson, Khaled Yaacoub, Teddy Kucaba

# Setup
I have not included my node_modules and .env files as part of my upload.
I used npm to initialize my server file called index.js, which handles my backend and routing.

To run this application, you need to install the following packages with npm:
* passport
* passport-local
* express
* body-parser
* mysql2
* crypto
* express-session
* express-mysql-session

Once you have done this, all you need to do is run the command 'npm run start'
This will start up the server and you can go to localhost:3000 to view the page.

# Using the System
This application is a beginner login application with user authenication and interaction with a database.

You can start with either the route 'localhost:3000/' or 'localhost:3000/register'. 
This will lead you to the user registration page, where a user can create a new user.
Make sure to pay careful attention to your email and password, as these will be needed for login.

After you have created a new user with your information, you will be redirected to the login page.
Enter your login crudentials, and you will be logged in. You will see a login-success page.
Click on the link to go to the protected route, and then you have been successfully authenticated!

Further implementation would include the required volunteer portal pages as described in a later sprint.