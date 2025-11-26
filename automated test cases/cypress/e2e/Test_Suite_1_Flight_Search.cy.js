describe("Test Suite 1: Flight Search Functionality", () => {
    beforeEach(() => {
        cy.visit("http://localhost:1420");
        cy.wait(2000);

        cy.contains("button", "Use Mock Data").click(); // Enable mock data
        cy.wait(500);
        cy.contains("button", "Use Real API").click(); // Click twice to ensure it's enabled
        cy.wait(500);
        cy.contains("button", "Use Mock Data").click(); // Triple click to be sure
        cy.wait(3000);
    });

    it("SAATM-1-1: Search by airline code ICT (multiple results)", () => {
        // 1. Type airline code
        cy.get('input[placeholder="Enter Flight ID"]').type("ICT");

        // 2. Press Search
        cy.contains("button", "Search").click();

        // 3. Should show list of ICT flights
        cy.contains("ICT").should("be.visible");
        cy.get("button").contains("ICT").should("exist");

        // Ensure only ICT flights appear
        cy.get("ul button").each(($btn) => {
            expect($btn.text()).to.match(/^ICT/);
        });

        // 4. Select specific flight ICT062
        cy.contains("button", "ICT062").click();

        // 5. Verify selected flight is visible (map selection UI)
        cy.contains("ICT062").should("be.visible");
    });

    it("SAATM-1-2: Search exact flight number BAW285", () => {
        // 1. Type exact flight ID
        cy.get('input[placeholder="Enter Flight ID"]').type("BAW285");

        // 2. Press Search
        cy.contains("button", "Search").click();

        // 3. Should immediately follow the flight (no list)
        cy.contains("BAW285").should("be.visible");

        // 4. Ensure no list is shown
        cy.get("ul").should("not.be.visible");
    });

    it("SAATM-1-3: Search for non-existing flight WTF555", () => {
        // 1. Type invalid flight
        cy.get('input[placeholder="Enter Flight ID"]').type("WTF555");

        // 2. Press Search
        cy.contains("button", "Search").click();

        // 3. Show expected error message
        cy.contains("No flights found").should("be.visible");

        // 4. Ensure no result list appears
        cy.get("ul").should("not.be.visible");
    });
});
