# Motivation

An API for user management for side projects


# Setup

Clone and create an `.env` in the root folder with the fields from `.env-sample` filled out

Run a quick `npm install` and then `npm start` will run a nodemon.

# API

## `GET: /create` Create a User

Request body:
```
{
  username: "crumplepunch",
  password: "leeroymjenk1ns"
}
```

#### Notes
1. Salting and hashing happens serverside, as salting exists mainly to protect against things like rainbow tables.

## `POST: /login` Login

Request Body:
```
{
  username: "crumplepunch",
  password: "leeroymjenk1ns"
}
```

Successful response format:
```
{
  user: {
    username: crumplepunch
  }
}
```

#### Notes
1. Update the login endpoint to return the fields you wish to return, like email, et. al.

## `DELETE: /user` Delete a user

Request Params:
```
<serverip>:<port>/user?username=crumplepunch
```

Successful response format:
```
{
  user: {
    username: crumplepunch
  }
}
```
