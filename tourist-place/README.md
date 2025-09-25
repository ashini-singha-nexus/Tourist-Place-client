# Tourist Place Client

This is an Angular application for managing tourist places. It allows users to perform CRUD (Create, Read, Update, Delete) operations for tourist places after logging in.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (which includes npm) installed on your machine.
- An instance of the corresponding backend server running. The API endpoint details can be found in the `endpoints-details.md` file in the parent directory.

### Installation

1. Clone the repository to your local machine.
2. Navigate to the `tourist-place` directory.
3. Install the required packages using npm:

   ```bash
   npm install
   ```

## Running the application

To start the development server, you can use either of the following commands:

```bash
npm start
```

or

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Building the project

To build the project for production, run:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Running unit tests

To execute the unit tests via [Karma](https://karma-runner.github.io), run:

```bash
ng test
```

## API Endpoints

This application requires a running backend to function correctly. The API endpoints and their specifications are detailed in the `endpoints-details.md` file located in the root of the parent `Tourist-Place-client` directory. Please ensure the backend server is running and accessible before starting this client application.