const request = require('request');

get_comic_id = function(date) {

    var day_of_month = date.getUTCDate();
    if (day_of_month < 10) day_of_month = '0' + day_of_month.toString(); //must be 2 digits

    var month = date.getUTCMonth() + 1; //indexed 0-11, we want 01-12
    if (month < 10) month = '0' + month.toString();

    var year = date.getUTCFullYear().toString().substring(2);

    return year + month + day_of_month; //YYMMDD

}

generate_comic_url = function (date) {
    return `http://picayune.uclick.com/comics/ch/${date.getUTCFullYear().toString()}/ch${get_comic_id(date)}.gif`;
}

check_comic = function (date) {
    
    var url = generate_comic_url(date);

    request(url, {}, (err,res,body) => {
        
        var status_code = res && res.statusCode;

        if (status_code == 200) {
            console.log(date.toUTCString() + ' succeeded');
        }

        else {
            console.log(date.toUTCString() + ' failed');
        }

    });

}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setUTCDate(date.getUTCDate() + days);
    return date;
}

function test () {
    console.log('hOI');
}

var start_date = new Date('1985-11-18');

//var cur_date = start_date;

// for (var i = 0; i < 1000; i++) {
//     cur_date = cur_date.addDays(1);
//     check_comic(cur_date);
// }

var end_date = new Date('1995-12-31');

console.log(start_date);
console.log(end_date);
var days_diff = (end_date - start_date)/ (1000 * 60 * 60 * 24) + 1;

for (var ctr = 0; ctr < 10000; ctr++) {
    var cur_date = start_date;
    cur_date = cur_date.addDays(Math.random() * days_diff)
    //console.log(get_comic_id(cur_date));

}
// var cur_date = new Date(start_date.toUTCString());

// var success = [];
// var failure = [];

// while (cur_date <= end_date) {

//     check_comic(new Date(cur_date.toUTCString()));

//     cur_date.setDate(cur_date.getDate()+1)

// }


