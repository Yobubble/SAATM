# SAATM (Semi-automated Air Traffic Management)
Air Traffic Controller Management System

This project is under the course **ITCS379 Practical Software Engineering**.

How to run

# SAATM's Frontend
## Development Instruction

1. run `npm install` (make sure you are inside frontend directory in the terminal)
2. run `npm run tauri dev`

# SAATM's Backend
## Development Instruction
How to run the backend
1. Make sure node.js already installed on your local machine
2. Open CMD and change path to backend
3. Install dependencies by `npm install`
4. run by `npm start`

# SAATM's Testing
## Testing Instruction
The testing part is under the course **ITCS473 Software Quality Assurance and Testing**

**Unit Test** 
  - Unit test coverage demonstration `tests/Unit test coverage demo.pdf`
  - Unit test report `frontend/coverage/index.html`
  - Test Code
        `frontend/src/lib/altitudeFilter.test.ts`
        `frontend/src/lib/flightSearch.test.ts`
        `frontend/src/lib/transcriptUtils.test.ts`
    
**System Test**
  - See the manual testing report `manual test cases\manual tests.docx`
  - See the tracability metric report `manual test cases\traceability matrix.xlsx`
    
**Automate UI Test**
  - How to run automated ui test, see `automated test cases/README.md`
  - See automated UI codes in `automated test cases\cypress\e2e`

