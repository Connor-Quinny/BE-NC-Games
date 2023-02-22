# NC Games Backend

This project is an API for a boardgames review website. It was made as the backend for this [frontend](https://github.com/Connor-Quinny/NC-games) and are both portfolio pieces as part of the [NorthCoders](https://northcoders.com/) Coding Bootcamp. 

A hosted version is available on https://be-nc-games-api.herokuapp.com/

To run this project in your local environment **fork** and **clone** this repository.

# Setup Instructions


1. Create these 2 files: `.env.devlopment` `.env.test`

2. Add this data to each file respectively: `PGDATABASE=nc_games` `PGDATABASE=nc_games_test`

3. `npm install`  - install dependencies

4. `npm run seed` - seed development data

5. `npm test app.test.js` - run tests


# Requirements

- node (v14) 
+ postgres (v10)
- dotenv
* express     
- jest
* jest-sorted
+ jest-extended
- supertest