//This script populates the db with the school data

//Load environment variables
var config         = require(__dirname + '/../../config/config');
var mongoose       = require('mongoose');
var q = require('q');

var School = require(__dirname + '/../models/school');


var fs = require('fs');
var schools;

return fs.readFile(__dirname + '/schools.json', 'utf8', function (err, data) {
    if (err) {
        throw err;
    }
    schools = JSON.parse(data);

    return School.remove({}, function(err) {
        if(err) {
            console.log(err);
        }
        console.log('Deleted Schools');
    }).then(function(){
        var promises = [];
        schools.forEach(function(school){
            //Create or update all the schools
            promises.push(School.create({
                name: school.name,
                entityName: school.entityName,
                alias: school.alias
            }, function(err, school) {
                if(err) {
                    console.log(err);
                    process.exit(1);
                }

            }));
        });
        return q.all(promises);
    });
});
