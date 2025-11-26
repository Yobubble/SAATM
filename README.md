# SAATM (Semi-automated Air Traffic Management)
## Air Traffic Controller Management System
Developed by Bad SE team.

This project is under the course **ITCS379 Practical Software Engineering**.

How to run:

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
  - Unit test coverage demonstration `frontend/src/lib/work-of-evidence.pdf`
  - Unit test report `frontend/coverage/index.html`
  - Test Code
       1. `frontend/src/lib/altitudeFilter.test.ts`
       2. `frontend/src/lib/flightSearch.test.ts`
       3. `frontend/src/lib/transcriptUtils.test.ts`
    
**System Test**
  - See the manual testing reports `manual test cases\manual tests.docx`
  - See the tracability metric report `manual test cases\traceability matrix.xlsx`
    
**Automate UI Test**
  - How to run automated ui test, see `automated test cases/README.md`
  - See automated UI codes in `automated test cases\cypress\e2e`
  - Test Code

    1  `automated test cases/cypress/e2e/Test_Suite_1_Flight_Search.cy.js`
          
    2  `automated test cases/cypress/e2e/Test_Suite_2_Altitude_Filter.cy.js`
           
    3.1  `automated test cases/cypress/e2e/Test_Suite_3_Hide_Info_Boxes.cy.js`
           
    3.2  `automated test cases/cypress/e2e/Test_Suite_3_Show_Info_Boxes.cy.js`

# Team's Members
## Bad SE
- Thanachot Onlamoon 6588062
- Pongkrit Ubontam 6588111
- Punnut Sawetwannakul 6588142 
- Bhurinat Kanchanasuwan 6588150
- Pawat Sukkasem 6588158
