# Northcoders News API

## Notice
When you clone this repository, you'll need to set up your environment variables to successfully connect to the psql databases locally.


### Steps:
<li> 
Create environment file ".env.<b>environment_name</b>" in the root directory.
</li>
<li> 
Define environment variables within file:   "PGDATABASE=<b>your_data_base</b>"
</li>
<ol>
| replace all of the <b>bold</b> with relevant information |
</ol>


###  instead follow these steps:

- go to https://nc-news-api-v5m5.onrender.com/api
- Lots of endpoints there feel! - free to use them while i write a proper MD


### Info
address above returns all current avaialble endpoints, these endpoints allow the user to retrieve information from the DB

### Some Instructions & notes in steps:

- repo: https://github.com/Byteuth/NC-News
- npm install
- npm setup-dbs, this will setup sql db
- npm seed, will seed db
- npm test, if running jest then will tests on all by default


- env.secretstuff, this will need to be created in the same directiory as app.js

- MIN VERSION REQ :
  "dependencies": {
    "dotenv": "^16.0.0",
    "express": "^4.19.2",
    "pg": "^8.11.5",
    "supertest": "^7.0.0"
  },









--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
