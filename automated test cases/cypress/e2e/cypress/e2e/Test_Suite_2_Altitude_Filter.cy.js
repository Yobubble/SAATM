describe('Test Suite1: Altitude Filter Functionality', () => {
  it('SAATM-2-1: Flight\'s altitude 0 - 16000 ft. filtering test', () => {
    cy.visit('http://localhost:1420')
    cy.wait(2000)
    cy.contains('button', 'Use Mock Data').click()
    cy.wait(2000)
    cy.contains('Altitude Filter').should('be.visible') // verify filter panel exists
    cy.get('input[placeholder="Min altitude"]').type('0')
    cy.contains('≥ 0 ft').should('be.visible')
    cy.get('input[placeholder="Max altitude"]').type('16000')
    cy.contains('0 - 16,000 ft').should('be.visible') // verify showing updated
  })

  it('SAATM-2-2: Flight\'s minimum altitude filtering test (10000 ft)', () => {
    cy.visit('http://localhost:1420')
    cy.wait(2000)
    cy.contains('button', 'Use Mock Data').click()
    cy.wait(2000) // wait for mock data to load
    cy.contains('Altitude Filter').should('be.visible') // verify filter panel exists
    cy.get('input[placeholder="Min altitude"]').type('10000')
    cy.contains('≥ 10,000 ft').should('be.visible') // verify display shows "≥ 10,000 ft"
  })

  it('SAATM-2-3: Flight\'s maximum altitude filtering test (16000 ft)', () => {
    cy.visit('http://localhost:1420')
    cy.wait(2000)
    cy.contains('button', 'Use Mock Data').click()
    cy.wait(2000) // wait for mock data to load
    cy.contains('Altitude Filter').should('be.visible') // verify filter panel exists
    cy.get('input[placeholder="Max altitude"]').type('16000')
    cy.contains('≤ 16,000 ft').should('be.visible') // verify display shows "≤ 16,000 ft"
  })

  it('SAATM-2-4: Clear all altitude filters test', () => {
    cy.visit('http://localhost:1420')
    cy.wait(2000)
    cy.contains('button', 'Use Mock Data').click()
    cy.wait(2000)
    cy.get('input[placeholder="Min altitude"]').type('8000')
    cy.get('input[placeholder="Max altitude"]').type('16000')
    cy.wait(500)
    cy.contains('8,000 - 16,000 ft').should('be.visible') // verify display shows "8,000 - 16,000 ft"
    cy.get('input[placeholder="Min altitude"]').clear() // clear minimum
    cy.get('input[placeholder="Max altitude"]').clear() // clear maximum
    cy.contains('No filter').should('be.visible') // verify display shows "No filter"
    // "all plains are visible"
  })
})
