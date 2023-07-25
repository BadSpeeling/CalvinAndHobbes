require('request')

var info = {};
info.start_date = new Date('1985-11-18');
info.end_date = new Date('1995-12-31');

function get_comic_id(date) {

    var day_of_month = date.getUTCDate();
    if (day_of_month < 10) day_of_month = '0' + day_of_month.toString(); //must be 2 digits

    var month = date.getUTCMonth() + 1; //indexed 0-11, we want 01-12
    if (month < 10) month = '0' + month.toString();

    var year = date.getUTCFullYear().toString().substring(2);

    return year + month + day_of_month; //YYMMDD

}

function generate_comic_url(date) {
    return `http://picayune.uclick.com/comics/ch/${date.getUTCFullYear().toString()}/ch${get_comic_id(date)}.gif`;
}

var curComicDate = new Date(info.start_date);

while (curComicDate.UTC() <= info.end_date.UTC()) {
    console.log(curComicDate.getUTCDate());
}

    request(url, {}, (err,comic_res,body) => {
            
        var status_code = comic_res && comic_res.statusCode;

        if (status_code == 200) {
            res.statusCode = 200;
            console.log(date.toUTCString() + ' succeeded');
        }

        else {
            res.statusCode = 500;
            console.log(date.toUTCString() + ' failed');
        }

    });
