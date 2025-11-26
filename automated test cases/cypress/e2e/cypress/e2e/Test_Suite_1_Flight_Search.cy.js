describe('Test Suite 1: Flight Search Functionality', () => {

    beforeEach(() => {
        cy.visit('http://localhost:1420')
        cy.wait(2000)

        cy.contains('button', 'Use Mock Data').click()// Enable mock data
        cy.wait(1500)
    })


    it('SAATM-1-1: Search by airline code ICT (multiple results)', () => {

        cy.get('input[placeholder="Search flight"]').type('ICT')// 1. Type airline code

        cy.contains('button', 'Search').click()// 2. Press Search

        cy.contains('ICT').should('be.visible')
        cy.get('button').contains('ICT').should('exist')// 3. Should show list of ICT flights

        cy.get('ul button').each($btn => {
            expect($btn.text()).to.match(/^ICT/)// Ensure only ICT flights appear
        })

        cy.contains('button', 'ICT062').click()// 4. Select specific flight ICT062

        cy.contains('ICT062').should('be.visible')// 5. Verify selected flight is visible (map selection UI)
    })


    it('SAATM-1-2: Search exact flight number BAW285', () => {

        cy.get('input[placeholder="Search flight"]').type('BAW285')// 1. Type exact flight ID

        cy.contains('button', 'Search').click()// 2. Press Search

        cy.contains('BAW285').should('be.visible')// 3. Should immediately follow the flight (no list)

        cy.get('ul').should('not.exist')// 4. Ensure no list is shown
    })


    it('SAATM-1-3: Search for non-existing flight WTF555', () => {

        cy.get('input[placeholder="Search flight"]').type('WTF555')// 1. Type invalid flight

        cy.contains('button', 'Search').click()// 2. Press Search

        cy.contains('No flights found').should('be.visible')// 3. Show expected error message

        cy.get('ul').should('not.exist')// 4. Ensure no result list appears
    })

})
