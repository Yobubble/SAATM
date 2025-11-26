describe('Test Suite 3: Hide Info Boxes', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should hide info boxes when "Hide Info Boxes" button is clicked', () => {
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

    cy.get('body').then(($body) => {
      
      cy.get('.leaflet-marker-icon').should('exist')
      
      cy.wait(1000)
      
      cy.get('body').should('not.contain', 'Hex:')
    })
  })
})
