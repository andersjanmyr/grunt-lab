window.view = function(model) {
    'use strict';

    var Age = model.Age;

    var age;

    var $date = $('#date');
    var $utc = $('#utc');
    var $week = $('#week');
    var $seconds = $('#seconds');
    var $fromNow = $('#fromNow');
    $('form').submit(function() {
        return false;
    });
    $date.on('change', function() {
        age && age.stop();
        age = new Age($date.val());
        age.on('second', function() {
            var date = age.born();
            $utc.text(date.utc());
            $week.text(date.week());
            $seconds.text(moment().diff(date, 'seconds'));
            $fromNow.text(date.fromNow());
        });
        age.start();
    })

;
};

