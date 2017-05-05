describe('Auth Tests', function() {
    beforeEach(function() {
        browser.get('http://localhost:8080/');
        browser.waitForAngular();
    });
    
    it('should be able to register a user', function() {
        //Find the login button by the ng-click function "login"
        var loginBtn = element(by.css('.navbar')).element(by.css('[ng-click="login()"]'));
        
        //Click login, open the modal
        loginBtn.click();

        //Fill out the email field
        var emailInput = element(by.model('email'));
        emailInput.sendKeys('a@a.a');

        //Fill out password field
        var passwordInput = element(by.css('[type="password"]'))
        passwordInput.sendKeys('a');


        //Click signup
        var signupBtn = element(by.css('.login-modal')).element(by.css('[ng-click="signup()"]'))
        signupBtn.click();

        //Wait for modal to close
        var EC = protractor.ExpectedConditions;
        var modalIsClosed = EC.not(EC.presenceOf(element(by.css('.login-modal'))));
        browser.wait(modalIsClosed, 3000); //If it takes more than three seconds to close, fail

        //Check to see if login btn is still there - if it is, something went wrong
        var loginBtn = element(by.css('.navbar')).element(by.css('[ng-click="login()"]'));
        expect(loginBtn.isPresent()).toEqual(false);
    });
});
