
define(['jquery', 'moment'], function($, moment) {
    'use strict';

    function Age(birthDate) {
        this.birthDate = moment(birthDate);
    }

    Age.prototype.born = function birthDate() {
        return this.birthDate;
    };

    var eventRoot = $(document);
    /*
     * Attach a listener for eventType.
     * Supported event types are: 'second'
     */
    Age.prototype.on = function on(eventType, callback) {
        eventRoot.on(eventType, callback);
    };

    function trigger(eventType, data) {
        eventRoot.trigger(eventType, data);
    }

    var interval;
    Age.prototype.start = function start() {
        interval = setInterval(function() {
            trigger('second');
        }, 1000);
    };

    Age.prototype.stop = function start() {
        clearInterval(interval);
    };

    return {
        Age: Age
    };
});
