# What's for dinner?
Tired of fighting over what to eat? Can't make up your mind? Want to keep track and share your favorite recipes? We've got you covered!

**Link to project:** https://whats-for-dinner.cyclic.app/

![Website showing recipes and food](https://github.com/Nam-Nguyen-Dev/whats-for-dinner/blob/main/public/imgs/wfdss.PNG)

## How It's Made:

**Tech used:** HTML, CSS, EJS, Node, Express, MongoDB

This project utilizes the Express module in Node to provide an MVC framework. The view is written in EJS, a Javascript templating language. MongoDB is used to store session, user, and recipe information. Cloudinary is the image hoster of choice and passport.js is in use for authentication.

## Optimizations

Initial attempts to generate a random recipe were dependent on being able to grab a random document from the MongoDB collection. This proves to be difficult as MongoDB auto-magically generates unique id's for each document. One potential solution for this issue is to get the count of all docouments in the collection, generate a random number between 0-count, and then skip that many number of documents to return a random one.

A newer solution now is to use MongoDB's aggregate method which will return a sample size of your choice and additionally allows you the ability to select random documents from a filtered subset of the collection.

## Lessons Learned:

I used Bootstrap to quickly build out the prototype and found out how helpful it can be to add a bit of style efficiently. Tailwind CSS code snippets are also very handy! I'd like to build a site with React next. I also learned how to implement Google OAuth alongside local auth. 



# Install

`npm install`

---

# Things to add

- Create a `.env` file in config folder and add the following as `key = value`
  - PORT = 2121 (can be any port example: 3000)
  - DB_STRING = `your database URI`
  - CLOUD_NAME = `your cloudinary cloud name`
  - API_KEY = `your cloudinary api key`
  - API_SECRET = `your cloudinary api secret`
  - GOOGLE_CLIENT_ID = `your google client id`
  - GOOGLE_CLIENT_SECRET = `your google client api secret`

---

# Run

`npm start`
