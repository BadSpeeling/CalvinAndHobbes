var driver = {};

driver.model = {};
driver.prev_model = null;

driver.loading = {}
driver.loading.load_begin = null;
driver.loading.min_wait_time = 2000 //milliseconds to show the loading spinner for
//returns null if enough time has passed (min_wait_time), otherwise returns difference in milliseconds
driver.loading.check_min_wait_time = function () {
    
    let ret = null;

    if (driver.loading.load_begin) {
        ret = driver.loading.min_wait_time - (Date.now() - driver.loading.load_begin);
    }

    return ret > 0 ? ret : null;

}

$(document).ready(() => {

    show_wrapper('LoadingWrapper');
    load_comic_set();
    $('.ThisComicWinsBtn, .ImgWrapper img').click(comicSubmitBtnClick);

});

function reset_model (comic_id) {
    driver.model[comic_id] = {comic_id: null,isLoaded: false};
}

function load_comic_set() {

    if (driver.model) {
        driver.prev_model = {...driver.model};
    }

    reset_model('comic1');
    reset_model('comic2');

    driver.loading.load_begin = Date.now();

    get_comic('comic1');
    get_comic('comic2');

}

//display the element id, 
function show_wrapper(id) {
    
    function handle_wrapper() {
        $(`#MainWrapper > #${id}`).show();
        $(`#MainWrapper > :not(#${id})`).hide();
    }

    //check if enough time has passed since a comic load was requested
    //wait the amount of time remaining if it hasn't
    if (id === 'ComicsWrapper') {
        let loading_timer = driver.loading.check_min_wait_time();

        if (loading_timer) {
            setTimeout(handle_wrapper,loading_timer);
        }
        else {
            handle_wrapper();
        }

    }
    else {
        handle_wrapper();
    }

}

function set_comics(container_id, comic_data) {

    var comicWrapper = $('#'+container_id+'.ComicWrapper');
    var infoWrapper = comicWrapper.find('.InfoWrapper');

    comicWrapper.find('.ImgWrapper img').attr({'src':comic_data.url});
    infoWrapper.find('.ComicDateValue').text(utils.pretty_date(comic_data.date));
    infoWrapper.find('.WinsValue').text(comic_data.votes.wins);
    infoWrapper.find('.WinPercentageValue').text(utils.pretty_percent(comic_data.votes));

    driver.model[container_id] = {
        "comic_id": parse_comic_id(comic_data.date),
        "isLoaded": true
    };

    if (can_show_comics()) {
        show_wrapper('ComicsWrapper');
        driver.loading.load_begin = null;
    }

}

function set_comics_display (speed) {
    $('#MainWrapper #ComicsWrapper').slideToggle(speed);
}

function can_show_comics() {
    return driver.model['comic1'].isLoaded && driver.model['comic2'].isLoaded;
}

function parse_comic_id (date) {

    var day_of_month = date.getUTCDate();
    if (day_of_month < 10) day_of_month = '0' + day_of_month.toString(); //must be 2 digits
  
    var month = date.getUTCMonth() + 1; //indexed 0-11, we want 01-12
    if (month < 10) month = '0' + month.toString();
  
    var year = date.getUTCFullYear().toString().substring(2);
  
    return year + month + day_of_month; //YYMMDD
  
}

function get_comic_id (container_id) {
    return driver.model[container_id].comic_id;        
}