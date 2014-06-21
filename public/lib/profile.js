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

    self.name = ko.observable('');
    self.about = ko.observable('');
    self.sports = ko.observableArray([]);
    self.friends = ko.observableArray([]);
    self.imageurl = ko.observable('');
}

// represent the current state of the edit form
function Profileform() {
    var self = this;

    self.previousimageurl = ko.observable();
    self.name = ko.observable();
    self.about = ko.observable();
    self.image = ko.observable();
    self.chosenSports = ko.observableArray([]);
}

// represent the profile viewmodel
// Arguments :
//  * url_map { loadUrl, getAllSports, saveUrl }
// Exposes : 
//  * allSports[] - { id:int, name:string }
//  * resetForm   - reset all value from the form
//  * load        - load the current data and set the profile
//  * submit      - submit the profile form
//
function ProfileVM( url_map ) {
    var self = this;

    self.profile = new Profile();
    self.profileForm = new Profileform();
    self.allSports = ko.observableArray([]);

    self.uploadProfilePicture = function ( file ) {
        self.profileForm.image = file;

        //Creating an XMLHttpRequest and sending
        var
         xhr = new XMLHttpRequest(),
         formData = new FormData();

        formData.append(file.name, file);
        xhr.open('POST', url_map.uploadProfilePicture);
        xhr.send(formData);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                alert(xhr.responseText);
            }
            //if (data.err) { alert('Failed'); }
            //self.profileForm.previousimageurl( data.imageurl );
        };
    };

    self.resetForm = function () {
        self.profileForm.name('');
        self.profileForm.about('');
        self.profileForm.image('');
        self.profileForm.chosenSports.removeAll();
    };

    // Begin Load of me profile
    self.load = function () {
        // Begin load of view model values
        $.getJSON(url_map.getAllSports, {}, function (data) {
            var all_sports;

            all_sports = data.map(function (sport) {
                return {
                    imageurl: sport.imageurl,
                    name: sport.name
                };
            });

            self.allSports(all_sports);
        });
        // End load of view model values

        // Begin load of profile values
        $.getJSON(url_map.loadUrl, {}, function (data) {
            var sports, friends;

            sports = data.Sports.map(function (sport) {
                return {
                    id: sport.Id,
                    imageurl: sport.ImageUrl,
                    name: sport.Name
                };
            });

            friends = data.Friends.map(function (friend) {
                return {
                    id: friend.Id,
                    imageurl: friend.ImageUrl,
                    name: friend.Name
                };
            });

            self.profile.name( data.Name );
            self.profile.about( data.About );
            self.profile.sports( sports );
            self.profile.friends( friends );
            self.profile.imageurl(data.ImageUrl);
        });
        // End load of profile form values
    };
    // End Load of me profile
    
    self.submit = function () {
        var profileForm_json = ko.toJSON(self.profileForm);

        $.post(url_map.saveUrl, profileForm_json, function ( data ) {
            self.profile.name( self.profileForm.name() );
            self.profile.about( self.profileForm.about() );
            self.profile.sports( self.profileForm.chosenSports() );
            self.profile.imageurl( self.profileForm.previousimageurl() );
            self.resetForm();
        });
    };
}