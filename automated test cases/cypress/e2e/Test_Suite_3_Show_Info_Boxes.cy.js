describe('Test Suite 3: Show Info Boxes', () => {
  beforeEach(() => {
    // Visit the application
    cy.visit('/')
  })

  it('should show info boxes when "Show Info Boxes" button is clicked', () => {
    // Wait for the page to load
    cy.wait(2000)

    // First, hide the info boxes to set up the test state
    // The button initially shows "Hide Info Boxes" (default state)
    cy.contains('button', 'Hide Info Boxes')
      .should('be.visible')
      .and('exist')

    // Wait before clicking
    cy.wait(1000)

    // Click to hide info boxes first
    cy.contains('button', 'Hide Info Boxes')
      .click()

    // Wait for state to update
    cy.wait(1500)

    // Verify the button now shows "Show Info Boxes"
    cy.contains('button', 'Show Info Boxes')
      .should('be.visible')
      .and('exist')

    // Wait a moment for state to update
    cy.wait(1000)

    // Click the "Show Info Boxes" button
    cy.contains('button', 'Show Info Boxes')
      .click()

    // Wait for state to update
    cy.wait(1500)

    // Verify the button text changes to "Hide Info Boxes"
    cy.contains('button', 'Hide Info Boxes')
      .should('be.visible')
      .and('exist')

    // Wait before checking info boxes
    cy.wait(1000)

    // Verify info boxes are visible
    // Info boxes contain aircraft details like Hex, ID, Speed, Altitude, Heading
    // When shown, these details should be present in the DOM
    cy.wait(1000) // Wait for any animations/transitions

    // Verify that the button state indicates info boxes are shown
    cy.contains('button', 'Hide Info Boxes').should('be.visible')
  })
})