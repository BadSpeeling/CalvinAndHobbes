var comic_loader = {};

comic_loader.start_date = new Date('1985-11-18');
comic_loader.end_date = new Date('1995-12-31');
comic_loader.runtime_milli = comic_loader.end_date - comic_loader.start_date;
comic_loader.milli_per_day = 1000 * 1 * 60 * 60 * 24;
comic_loader.comic_runtime_days = comic_loader.runtime_milli / comic_loader.milli_per_day;

comic_loader.get_comic_date = function () {

    var day = Math.floor(Math.random() * (comic_loader.comic_runtime_days+1));
    var ret = new Date(comic_loader.start_date);

    ret.setDate(comic_loader.start_date.getDate() + day);
    return ret;

}

//get the ID for a comic, the primary key for a comic in the database
comic_loader.get_comic_id = function(date) {

    var day_of_month = date.getDate();
    if (day_of_month < 10) day_of_month = '0' + day_of_month.toString(); //must be 2 digits

    var month = date.getMonth() + 1; //indexed 0-11, we want 01-12
    if (month < 10) month = '0' + month.toString();

    var year = date.getFullYear().toString();

    return year + month + day_of_month; //YYYYMMDD

}

//get the file name based on a date for the hosting service
comic_loader.generate_comic_url = function (date) {

    var day_of_month = date.getDate();
    if (day_of_month < 10) day_of_month = '0' + day_of_month.toString(); //must be 2 digits

    var month = date.getMonth() + 1; //indexed 0-11, we want 01-12
    if (month < 10) month = '0' + month.toString();

    var year = date.getFullYear().toString().substring(2); //we want YY ex. 85 or 95

    var file_name = "ch" + year + month + day_of_month + ".gif";
    return `http://picayune.uclick.com/comics/ch/${date.getFullYear()}/${file_name}`;

}

comic_loader.new_comic = function (container_id, attempt_no) {

    //keep track of how many times we've tried to do a load this routine
    console.log('attempt #' + (attempt_no) + " for " + container_id);

    if (attempt_no <= 3) {

        date = comic_loader.get_comic_date();
        comic_id = comic_loader.get_comic_id(date);
        comic_url = comic_loader.generate_comic_url(date);

        data_received = (snapshot) => {
            
            if (snapshot && snapshot.val()) {
                
                var cur_comic_model = {
                    'wins': snapshot.val()['wins'],
                    'losses': snapshot.val()['losses'],
                    'date': date,
                    'comic_id': comic_id
                }

                driver.model[container_id] = cur_comic_model;

                var comic_wrapper = $(`#${container_id}`);
                //set the ui for the given container with the approp values
                comic_wrapper.find('.ImgWrapper img').attr('src', comic_url);
                comic_wrapper.find('.InfoWrapper .ComicDateValue').text(utils.pretty_date(cur_comic_model.date));
                comic_wrapper.find('.InfoWrapper .WinsValue').text(cur_comic_model.wins);
                comic_wrapper.find('.InfoWrapper .WinPercentageValue').text(utils.pretty_percent(cur_comic_model));

                console.log(cur_comic_model);

            }

        }

        //what we do if the comic could not be loaded
        url_dne = () => {
            console.log(`${comic_id} could not find a source comic at ${comic_url}`)
            comic_loader.new_comic(container_id,attempt+1);
        }

        checkImage(comic_url, () => db.get_comic_data(comic_id,data_received), url_dne);

    }

}

comic_loader.fresh_comic_set = function () {

    attempt_no = 1;
    comic_loader.new_comic('comic1', attempt_no);

}

comic_loader.comic_selected = function (e) {
    comic_loader.fresh_comic_set();
}

function checkImage (src, good, bad) {
    var img = new Image();
    img.onload = good;
    img.onerror = bad;
    img.src = src;
}

// checkImage(
//     comic_loader.generate_comic_url(comic_loader.get_comic_date()),
//     function() {alert("good");}, 
//     function() {alert("bad")}
//  );

