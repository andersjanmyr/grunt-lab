
window.Model = function(moment) {
    'use strict';

    function Age(birthDate) {
        this.birthDate = moment(birthDate);
    }

    Age.prototype.birthDate = function birthDate() {
        return this.birthDate;
    };

    Age.prototype.born = function born() {
        return this.birthDate.fromNow();
    };

    return {
        Age: Age
    };

};
