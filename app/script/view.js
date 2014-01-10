window.view = function(model) {
    'use strict';

    var Age = model.Age;

    var age;

    var $age = $('#age');
    var $birthDate = $('#birthdate');

    $birthDate.on('change', function() {
        age && age.stop();
        age = new Age($birthDate.val());
        console.log(age);
        age.on('second', function() {
            $age.text(age.born());
        });
        age.start();
    })

;
};

