var config = {
    apiKey: "AIzaSyChi5K4Dqnb0GsofDL2WKRE1rraiAQO5mQ",
    authDomain: "chvoter-3f440.firebaseapp.com",
    databaseURL: "https://chvoter-3f440.firebaseio.com",
    projectId: "chvoter-3f440",
    storageBucket: "chvoter-3f440.appspot.com",
    messagingSenderId: "651064768229"
};

firebase.initializeApp(config);

//returns the file path to a random comic
function generateRandomFilePath() {

    var rNum = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
    var dir = "comics" + rNum;
    
    var comicFileNameArr = [];

    switch(rNum) {
        case 1:
            comicFileNameArr = file1;
            break;
        case 2:
            comicFileNameArr = file2;
            break;
        case 3:
            comicFileNameArr = file3;
            break;
        case 4:
            comicFileNameArr = file4;
            break;
        default:
            break;
    }

    var index = Math.floor(Math.random() * (comicFileNameArr.length-1 - 0 + 1)) + 0;
    var fileName = comicFileNameArr[index];
    return dir + "/" + fileName;

}

function setStatsFor (ID) {

    if (ID.indexOf('.') == -1) {

        firebase.database().ref(ID).once('value').then(function(snapshot){
            [winsElem,lossesElem] = getWinLossElements(ID);
            winsElem.innerText = snapshot.val().wins;
            lossesElem.innerText = snapshot.val().losses;
        })

    }

}

//TODO: update DB and squishing animation

function update (winner, loser) {

    var winnerID = extractFileID(winner);
    var loserID = extractFileID(loser);

    incWins(winnerID);
    incLosses(loserID);

    pushStats(winnerID, loserID);

    newComics();

}

function pushStats (ID1, ID2) {
    
    [ID1wins, ID1losses] = getWinLossElements(ID1);
    [ID2wins, ID2losses] = getWinLossElements(ID2);

    firebase.database().ref(ID1).update({
        wins: parseInt(ID1wins.innerText),
        losses: parseInt(ID1losses.innerText)
    });

    firebase.database().ref(ID2).update({
        wins:parseInt(ID2wins.innerText),
        losses:parseInt(ID2losses.innerText)
    });

}

function newComics () {

    var newTopComicPath = generateRandomFilePath();
    var newBottomComicPath = generateRandomFilePath();

    document.getElementById("uxTopComic").src = newTopComicPath;
    document.getElementById("uxBottomComic").src = newBottomComicPath;
    
    var newTopID = extractFileID(newTopComicPath);
    var newBottomID = extractFileID(newBottomComicPath);

    console.log("Top: " + newTopID);
    console.log("Bottom: " + newBottomID);

    setStatsFor(newTopID);
    setStatsFor(newBottomID);

}

function incWins (ID) {
    var [wins,_] = getWinLossElements(ID);
    wins.innerText = parseInt(wins.innerText)+1 
}

function incLosses (ID) {
    var [_,losses] = getWinLossElements(ID);
    losses.innerText = parseInt(losses.innerText)+1 
}

//returns the HTML element related to IDs wins and losses
function getWinLossElements (ID) {

    var top = document.getElementById("uxTopComic");

    //ID is in the top comic
    if (top.src.indexOf(ID) != -1) {
        return [document.getElementById("uxTopWins"), document.getElementById("uxTopLosses")];
    }

    else {
        return [document.getElementById("uxBottomWins"), document.getElementById("uxBottomLosses")];    
    }

}

function printComicIDS () {
    console.log(extractFileID(document.getElementById("uxTopComic").src));
    console.log(extractFileID(document.getElementById("uxBottomComic").src));
}

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

    ref.set(json);


}
