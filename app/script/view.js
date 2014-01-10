window.view = function(model) {
    'use strict';

    var Age = model.Age;

    var age = new Age('1969-03-18');
    console.log(age);
    age.on('second', function() {
        console.log('tick');
    });
    age.start();
};

