# Movie Rental API

Movie Rental RESTful API is developed in Node.js using express and mongoose frameworks. 

## Deployments:

The API is deployed to three platforms including Heroku, AWS and GCP.

1. [Heroku](https://nodejs-mongoose-demo.herokuapp.com)

2. [AWS](http://ec2-52-90-154-241.compute-1.amazonaws.com:3000/)

3. [GCP](https://nodejs-mongodb-demo.el.r.appspot.com/)

Find API operations and details in the sections below. 

## Users

### Register users 
Users can register to the service with the following rules:

* "username" is not allowed to be empty
* "username" length must be less than or equal to 10 characters long
* "password" is not allowed to be empty
* "email" is not allowed to be empty
* "email" must be a valid email
* "email" length must be at least 15 characters long
* "phone" is not allowed to be empty
* "phone" length must be at least 8 characters long
* “Username” and “email” should be unique

  **Endpoint:** “/users/register”

  **Example:** 
  
  ```
  {
    "username":"tempUser",
    "password":"12345",
    "email":"tempUser@gmail.com",
    "phone":"12345678"
  }
  ```

### Login user 
Users can log in by providing the following fields
* Username
* Password

  **Example:**
  
  ```
  {
     "username": "tempUser",
     "password":  "12345"
  }
  ```

  **Endpoint:** “/users/login”

  A JSON WEB TOKEN (JWT) is returned in case of a successful login. JWT can be sent with subsequent API calls to perform operations that required authentication and authorization. 

  ```
  X-auth-token: “JWT value”
  ```

## Genres
All CRUD operations are allowed on Genres. 

* Get All Genres: 

  **Endpoint:** “/”

* Get details of a single Genre: 
  **Endpoint:** “/genres/id”

* Add new Genre: 
  **Endpoint:** “/genres/add”

  **Example:**
  
  ```
  {
    "title":"Horror"
  }
  ```

* Update an existing Genre: 

  **Endpoint:** “/genres/update”

  **Example:**
  
  ```
  {
     "_id": "62ef7159a21d92ab253e6977",
     "title": "Horror"
  }
  ```

* Delete an existing Genre:

  **Endpoint:** “/genre/delete”

  To delete a Genre, the logged-in user should be authorized to delete the Genre. “isAdmin” attribute can be set true when registering a user as an authorized admin. 
  **Example:**

  ```
  {
     "_id": "62ef7159a21d92ab253e6977"
  }
  ```

## Movies
All CRUD operations are allowed in Movies.
* Get all movies: 

  **Endpoint**: “/movies”

* Get details of a single Movie: 

  **Endpoint:** “/movies/id”

* Add a new movie: 

  **Endpoint:** “/movies/add”

  A new movie can be added with the following rules:
  - "name" is required
  - "dailyRent" is required
  - "dailyRent" must be less than or equal to 50
  - "dailyRent" is required
  - "stock" is required
  - "stock" must be less than or equal to 100
  - "_id_genre" is required: “_id_genre” should be a valid “_id” of a genre
  **Example:**
  
  ```
  {
     "name": "Temppp Movie",
     "stock": 100,
     "dailyRent": 45,
     "_id_genre": "62ef7159a21d92ab253e6977"
  }
  ```
* Update a movie: 

  **Endpoint:** “/movies/update”

  **Example:** 
  
  ```
  {
     "_id": "62e7b8ad5f087bef83449430",
     "name": "Temppp Movie",
     "stock": 50,
     "dailyRent": 50,
     "_id_genre": "62ef7159a21d92ab253e6977"
  }
  ```

* Delete a movie: 

  **Endpoint:** “/movies/delete”

  To delete a Movie, the logged-in user should be authorized to delete the Genre. “isAdmin” attribute can be set true when registering a user as an authorized admin. 

  **Example:** 
  
  ```
  {
     "_id": "62e7b8ad5f087bef83449430"
  }
  ```

## Rentals

Following two operations are allowed for rentals:

* Get all rentals: 

  **Endpoint:** “/rentals”

* Rent out a new movie: 

  **Endpoint:** “/rentals/rentOut”
  
  **Example:** 
 
  ```
  {
     "_id_movie": "62e7b8ad5f087bef83449430",
     "_id_user":  "62e7b2ae4e077bwf83454501"
  }
  ```
  
  **Sample output:**
  
  ```
  {
     "user": {
         "_id": "62ef1c9262caa9621a366dbf",
         "username": "test12",
         "phone": "12312312"
     },
     "movie": {
         "name": "Temppp Movie",
         "dailyRent": 45
     },
     "returnDate": "2022-08-22T08:13:59.764Z",
     "_id": "62ef744799cff2b808b667b1",
     "rentStartDate": "2022-08-07T08:13:59.775Z",
  }
  ```
