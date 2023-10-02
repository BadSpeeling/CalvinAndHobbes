var driver = {};
driver.model = {};

driver.model.get_comic_id = (container_id) => {
    return driver.model[container_id].comic_id;        
}

$(document).ready(() => {

    reset_model('comic1');
    reset_model('comic2');

    load_comic_set();
    $('.ThisComicWinsBtn').click(comicSubmitBtnClick);

});

function reset_model (comic_id) {
    driver.model[comic_id] = {comic_id: null,isLoaded: false};
}

function load_comic_set() {
    get_comic('comic1');
    get_comic('comic2');
}

function display_comic(container_id, comic_data) {

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
        set_comics_display('slow');
    }

}

function set_comics_display (speed) {
    $('#ComicsWrapper').slideToggle(speed);
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