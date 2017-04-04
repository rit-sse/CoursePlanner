'use strict';

//This script populates the db with the school data
var q = require('q');
var School = require(__dirname + '/../models/school');

var fs = require('fs');

fs.readFile(__dirname + '/schools.json', 'utf8', function (err, data) {
    if (err) {
        throw err;
    }
    var schools = JSON.parse(data);

    return School.remove({})
    .then(function() {
        console.log('Deleted Schools');
    })
    .then(function(){
        var promises = [];
        schools.forEach(function(school){
            //Create or update all the schools
            promises.push(School.create({
                name: school.name,
                entityName: school.entityName,
                alias: school.alias
            })
            .catch(function(err) {
                if(err) {
                    console.log(err);
                }
            }));
        });
        return q.all(promises);
    })
    .catch(function(err){
        console.log(err);
    });
});
