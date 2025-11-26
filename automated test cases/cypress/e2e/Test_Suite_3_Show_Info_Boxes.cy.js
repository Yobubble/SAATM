describe('Test Suite 3: Show Info Boxes', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1420')
  })

  it('should show info boxes when "Show Info Boxes" button is clicked', () => {
    cy.wait(2000)

    cy.contains('button', 'Hide Info Boxes')
      .should('be.visible')
      .and('exist')

    cy.wait(1000)

    cy.contains('button', 'Hide Info Boxes')
      .click()

    cy.wait(1500)

    cy.contains('button', 'Show Info Boxes')
      .should('be.visible')
      .and('exist')

    cy.wait(1000)

    cy.contains('button', 'Show Info Boxes')
      .click()

    cy.wait(1500)

    cy.contains('button', 'Hide Info Boxes')
      .should('be.visible')
      .and('exist')

    cy.wait(1000)

    cy.wait(1000)

    cy.contains('button', 'Hide Info Boxes').should('be.visible')
  })
})
