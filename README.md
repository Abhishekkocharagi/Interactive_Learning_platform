# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
# 🚀 Project Setup Guide (Frontend Testing with JSON Server)

This section details the commands needed to run the mock backend using JSON Server and the React frontend simultaneously. This setup is typically used for development and testing when the main MERN backend is not yet fully integrated or is offline.

---

## 1. 💾 Start the Mock Backend (JSON Server)

Open your first terminal window and run this command from the root of your project:

```bash
# Terminal 1 - JSON Server
npx json-server --watch db.json --port 3001

# Terminal 2 - React App (if not running)
npm start

