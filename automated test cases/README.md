# Automated UI Test Cases

This folder contains automated UI test suites for the SAATM (Semi-automated Air Traffic Management) application using Cypress.

## Overview

The automated tests are based on the manual test cases created in the `manual test cases` folder. There are 3 test suites covering:

1. **Test Suite 1: Flight Search Functionality** - Tests flight search, selection, and stop following features
2. **Test Suite 2: Altitude Filter Functionality** - Tests altitude filtering with min/max values and range filtering
3. **Test Suite 3: Toggle Features Functionality** - Tests all toggle buttons (mock data, air route, info box, transcript)

## Prerequisites

1. **Node.js and npm**
2. **Cypress**
3. **Application running** - The frontend application must be running on `http://localhost:1420`

## Steps to run Tests

### Step 1: Install Cypress

```bash
cd frontend
npm install --global cypress
```

### Step 2: Start the Frontend

```bash
cd frontend
npm run dev
```

Keep this terminal running! The app should be at http://localhost:1420

### Step 3: Start the Backend

```bash
cd backend
npm run start
```

Keep this terminal running! The app should be at http://localhost:3000

### Step 4: Run Tests (in a NEW terminal)

```bash
cd "automated test cases"
npx cypress open
```

Then:

- Click "Add add project" at path `automated test cases`
- Choose your browser
- Click on a test file to run it
