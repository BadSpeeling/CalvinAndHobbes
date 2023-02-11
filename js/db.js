db = {}

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

db.config = {
    apiKey: "AIzaSyChi5K4Dqnb0GsofDL2WKRE1rraiAQO5mQ",
    authDomain: "chvoter-3f440.firebaseapp.com",
    databaseURL: "https://chvoter-3f440.firebaseio.com",
    projectId: "chvoter-3f440",
    storageBucket: "chvoter-3f440.appspot.com",
    messagingSenderId: "651064768229",
    appId: "1:651064768229:web:d81cc0c5bef44ab411c60c"
};

firebase.initializeApp(db.config);

//assumes that name is of the form {comicDirectory}/{comicFileName}
//comicFileName is the primary key for each firebase entry
function extractFileID (name) {
    return name.substring(name.length-12, name.length-4);
}

function initDB () {

    var json = {};

    for (i = 0; i < file1.length; i++) {
        json[extractFileID(file1[i])] = {wins:0,losses:0};
    }
    
    for (i = 0; i < file2.length; i++) {
        json[extractFileID(file2[i])] = {wins:0,losses:0};
    }
    
    for (i = 0; i < file3.length; i++) {
        json[extractFileID(file3[i])] = {wins:0,losses:0};
    }
    
    for (i = 0; i < file4.length; i++) {
        json[extractFileID(file4[i])] = {wins:0,losses:0};
    }

    var ref = firebase.database().ref("/");

    var to_post = {"comics": json};
    ref.set(to_post);

}

db.get_comic_data = function(comic_id, data_func) {

    firebase.database().ref('/comics/' + comic_id).once('value').then(data_func);

}

db.update_comic_data = function(model) {

    var to_post = {
        'wins': model.wins,
        'losses': model.losses
    };

    firebase.database().ref('/comics/' + model.comic_id).set(to_post);

}