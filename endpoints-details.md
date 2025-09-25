
# Tourist Place API Endpoints

This document provides a detailed overview of the API endpoints for the Tourist Place application.

## Authentication Endpoints

The following endpoints are used for user authentication.

### 1. Register

- **Endpoint:** `/auth/register`
- **Method:** `POST`
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "username": "string (min_length: 3, max_length: 20, regex: ^[a-zA-Z0-9_]+$)",
    "email": "string (max_length: 50, regex: ^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$)",
    "password": "string (min_length: 8)"
  }
  ```
- **Response Body (200 OK):**
  ```json
  {
    "username": "string",
    "email": "string",
    "id": "uuid"
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: If the email or username is already registered.

### 2. Login

- **Endpoint:** `/auth/login`
- **Method:** `POST`
- **Description:** Logs in a user and returns an access token.
- **Request Body:**
  - `x-www-form-urlencoded`
  - `username`: The user's username.
  - `password`: The user's password.
- **Response Body (200 OK):**
  ```json
  {
    "access_token": "string",
    "token_type": "bearer"
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: If the username or password is incorrect.

## Places Endpoints

The following endpoints are used to manage tourist places.

### 1. Create Place

- **Endpoint:** `/places/`
- **Method:** `POST`
- **Description:** Creates a new tourist place.
- **Authentication:** `Bearer Token` required.
- **Request Body:**
  ```json
  {
    "title": "string (min_length: 3, max_length: 50)",
    "description": "string (min_length: 10, max_length: 500)",
    "location": "string (min_length: 3, max_length: 100)"
  }
  ```
- **Response Body (200 OK):**
  ```json
  {
    "title": "string",
    "description": "string",
    "location": "string",
    "id": "uuid",
    "created_at": "datetime",
    "owner_id": "uuid"
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: If the user is not authenticated.

### 2. Read Places

- **Endpoint:** `/places/`
- **Method:** `GET`
- **Description:** Retrieves a list of tourist places.
- **Query Parameters:**
  - `skip`: `integer` (optional) - Number of places to skip.
  - `limit`: `integer` (optional, default: 10, lte: 100) - Maximum number of places to return.
  - `sort`: `string` (optional, default: "created_at:desc", regex: "^\\w+:(asc|desc)$") - Sort order.
- **Response Body (200 OK):**
  ```json
  [
    {
      "title": "string",
      "description": "string",
      "location": "string",
      "id": "uuid",
      "created_at": "datetime",
      "owner_id": "uuid"
    }
  ]
  ```

### 3. Read Place

- **Endpoint:** `/places/{place_id}`
- **Method:** `GET`
- **Description:** Retrieves a specific tourist place by its ID.
- **Path Parameters:**
  - `place_id`: `uuid` - The ID of the place to retrieve.
- **Response Body (200 OK):**
  ```json
  {
    "title": "string",
    "description": "string",
    "location": "string",
    "id": "uuid",
    "created_at": "datetime",
    "owner_id": "uuid"
  }
  ```
- **Error Responses:**
  - `404 Not Found`: If the place with the specified ID does not exist.

### 4. Update Place

- **Endpoint:** `/places/{place_id}`
- **Method:** `PUT`
- **Description:** Updates a specific tourist place.
- **Authentication:** `Bearer Token` required.
- **Path Parameters:**
  - `place_id`: `uuid` - The ID of the place to update.
- **Request Body:**
  ```json
  {
    "title": "string (optional)",
    "description": "string (optional)",
    "location": "string (optional)"
  }
  ```
- **Response Body (200 OK):**
  ```json
  {
    "title": "string",
    "description": "string",
    "location": "string",
    "id": "uuid",
    "created_at": "datetime",
    "owner_id": "uuid"
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user is not the owner of the place.
  - `404 Not Found`: If the place with the specified ID does not exist.

### 5. Delete Place

- **Endpoint:** `/places/{place_id}`
- **Method:** `DELETE`
- **Description:** Deletes a specific tourist place.
- **Authentication:** `Bearer Token` required.
- **Path Parameters:**
  - `place_id`: `uuid` - The ID of the place to delete.
- **Response Body (204 No Content):**
- **Error Responses:**
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user is not the owner of the place.
  - `404 Not Found`: If the place with the specified ID does not exist.

