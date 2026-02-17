# ResolveNow Frontend

This is the frontend application for the ResolveNow complaint management system built with React.js.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Environment Variables

The frontend communicates with the backend API. Make sure the API URL in the components matches your backend URL:

```javascript
const API_URL = 'http://localhost:5000/api';
```

## Component Structure

- **common/**: Shared components used across the application
  - Home, Login, SignUp, About, Footer, ChatWindow
- **user/**: Components for regular users
  - HomePage, Complaint, Status
- **agent/**: Components for agents
  - AgentHome
- **admin/**: Components for administrators
  - AdminHome, UserInfo, AgentInfo, AccordionAdmin

## Features

- User authentication with JWT
- Real-time complaint tracking
- Built-in chat system
- Responsive design with Bootstrap and Material-UI
- Role-based access control (User, Agent, Admin)

## Learn More

To learn more about React, check out the [React documentation](https://reactjs.org/).
