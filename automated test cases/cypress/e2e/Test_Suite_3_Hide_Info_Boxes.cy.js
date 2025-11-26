describe('Test Suite 3: Hide Info Boxes', () => {
  beforeEach(() => {
    // Visit the application
    cy.visit('/')
  })

  it('should hide info boxes when "Hide Info Boxes" button is clicked', () => {
    // Wait for the page to load
    cy.wait(2000)

    // Verify the button initially shows "Hide Info Boxes" (default state)
    cy.contains('button', 'Hide Info Boxes')
      .should('be.visible')
      .and('exist')

    // Wait before clicking
    cy.wait(1000)

    // Click the "Hide Info Boxes" button
    cy.contains('button', 'Hide Info Boxes')
      .click()

    // Wait for state to update
    cy.wait(1500)

    // Verify the button text changes to "Show Info Boxes"
    cy.contains('button', 'Show Info Boxes')
      .should('be.visible')
      .and('exist')

    // Wait before checking info boxes
    cy.wait(1000)

    // Verify info boxes are hidden by checking that info box content is not visible
    // Info boxes contain aircraft details like Hex, ID, Speed, Altitude, Heading
    // Since info boxes are hidden, we should not see these details
    cy.get('body').then(($body) => {
      // Check that info box elements are not visible
      // The info boxes are rendered as divs with specific styling
      // When hidden, the statsHtml is an empty string, so we verify no info box content exists
      cy.get('.leaflet-marker-icon').should('exist')
      
      // Wait a moment for any animations/transitions
      cy.wait(1000)
      
      // Verify that info box content (like "Hex:", "ID:", "Speed:", etc.) is not visible
      // This is a negative assertion - we're checking these elements don't exist or are hidden
      // When info boxes are hidden, the statsHtml is an empty string, so info box content should not be in the DOM
      cy.get('body').should('not.contain', 'Hex:')
    })
  })
})