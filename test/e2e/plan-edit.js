describe('Plan Edit Tests', function() {
    beforeEach(function() {
        browser.get('http://localhost:8080/');
        browser.waitForAngular();
    });
    
    it('should add a year when you click the add year button', function() {
        var years = element.all(by.repeater('year in plan.years'));
        expect(years.count()).toEqual(0); //Should be 0 to start

        var addYearBtn = element(by.css('.add-year-btn'));
        addYearBtn.click();

        years = element.all(by.repeater('year in plan.years'));
        expect(years.count()).toEqual(1); //Now there is 1!

        //Click 3 more times
        addYearBtn.click();
        addYearBtn.click();
        addYearBtn.click();
        years = element.all(by.repeater('year in plan.years'));
        expect(years.count()).toEqual(4); //Now there is 4!
    });

    it('should be able to add a course to a year', function() {
        element(by.css('.add-year-btn')).click(); //Add a year

        //Double check there is just one year here now
        var years = element.all(by.repeater('year in plan.years'));
        expect(years.count()).toEqual(1); 

        //Lets add a course to the first semester
        var semesters = years.first().all(by.repeater('semester in year.semesters'));
        expect(semesters.count()).toEqual(2); //Sanity check that there are 2 semesters

        var courses = semesters.first().all(by.repeater('c in semester.classes'));
        expect(courses.count()).toEqual(0); //Sanity check that there are no courses yet

        //Click the add class button
        semesters.first().element(by.css('.add-class-btn')).click();

        courses = semesters.first().all(by.repeater('c in semester.classes'));
        expect(courses.count()).toEqual(1); //There should be a course now
    });

    it('should be able to delete a year that it has added', function() {
        //There should be one year after clicking this button
        element(by.css('.add-year-btn')).click();
        var years = element.all(by.repeater('year in plan.years'));
        expect(years.count()).toEqual(1); 

        //There should be no years after we delete it
        element(by.css('.year-more')).click();
        element(by.css('.delete-year-btn')).click();
        years = element.all(by.repeater('year in plan.years'));
        expect(years.count()).toEqual(0); 
    });
});
