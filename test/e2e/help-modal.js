describe('Help Modal Tests', function() {
    beforeEach(function() {
        browser.get('http://localhost:8080/');
        browser.waitForAngular();
    });
    
    it('should open and close the help modal', function() {
        //Check that the modal is not open
        var helpModal = element(by.id('help-modal'));
        expect(helpModal.isPresent()).toBeFalsy();

        //Click "Help"
        element(by.id('open-help-modal')).click();

        //Check that the modal is open
        helpModal = element(by.id('help-modal'));
        expect(helpModal.isPresent()).toBeTruthy();

        //Click "Close"
        element(by.buttonText('Close')).click();

        //Check that the modal is not open
        var helpModal = element(by.id('help-modal'));
        expect(helpModal.isPresent()).toBeFalsy();
    });
});
