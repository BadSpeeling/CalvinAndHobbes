var driver = {};
driver.model = {};

$(document).ready(() => {

    load_comic_set();
    $('.ThisComicWinsBtn').click(comicSubmitBtnClick);

});

function load_comic_set() {
    get_comic('comic1');
    get_comic('comic2');
}

function display_comic(id, comic_data) {

    var comicWrapper = $('#'+id+'.ComicWrapper');
    var infoWrapper = comicWrapper.find('.InfoWrapper');

    comicWrapper.find('.ImgWrapper img').attr({'src':comic_data.url});
    infoWrapper.find('.ComicDateValue').text(utils.pretty_date(comic_data.date));
    infoWrapper.find('.WinsValue').text(comic_data.votes.wins);
    infoWrapper.find('.WinPercentageValue').text(utils.pretty_percent(comic_data.votes));

    driver.model[id] = get_comic_id(comic_data.date);

}

function get_comic_id (date) {

    var day_of_month = date.getUTCDate();
    if (day_of_month < 10) day_of_month = '0' + day_of_month.toString(); //must be 2 digits
  
    var month = date.getUTCMonth() + 1; //indexed 0-11, we want 01-12
    if (month < 10) month = '0' + month.toString();
  
    var year = date.getUTCFullYear().toString().substring(2);
  
    return year + month + day_of_month; //YYMMDD
  
  }