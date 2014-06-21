/*
* profile.js
*/

/*jslint browser : true, continue : true,
  devel : true, indent : 2, maxerr : 50,
  newcap : true, nomen : true, plusplus : true,
  regexp : true, sloppy : true, vars : false,
  white : true
 */

/*global $, ko */

// represent the profile information
function Profile() {
    var self = this;

    self.name     = ko.observable();
    self.about    = ko.observable();
    self.sports   = ko.observableArray();
    self.imageurl = ko.observable();
}

// represent the current state of the edit form
function Profileform() {
    var self = this;

    self.name   = ko.observable();
    self.about  = ko.observable();
    self.image  = ko.observable();
    self.chosenSports = ko.observableArray([]);
}

// represent the profile viewmodel
// exposes : 
//  * allSports[] - { id:int, name:string }
//  * resetForm   - reset all value from the form
//  * load        - load the current data and set the profile
//  * submit      - submit the profile form
//
function ProfileVM() {
    var self = this;
    self.profile      = new Profile();
    self.profileForm = new Profileform();
    self.allSports   = ko.observableArray([
        { id : 1, name : 'Soccer'},
        { id : 2, name : 'Basket'},
        { id : 3, name : 'Volley'}
    ]);

    self.resetForm = function() {
        self.profileForm.name('');
        self.profileForm.about('');
        //self.profile.sports()
    };

    self.load = function ( url ) {
        $.getJSON( url, {}, function ( data ) {
            self.profile.name( data.Name );
            self.profile.about( data.About );
            self.profile.sports( data.Sports );
            self.profile.imageurl( data.ImageUrl );
        });
    };

    self.submit = function ( url ) {
        // var profile_form_json = ko.toJSON(self.profileForm);
        // $.post( url, profile_form_json);

        self.profile.name( self.profileForm.name() );
        self.profile.about( self.profileForm.about() );
        self.profile.sports( self.profileForm.chosenSports() );
    };
}

var profileVM = new ProfileVM();

$(function() {
    ko.applyBindings(profileVM);
});