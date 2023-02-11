var driver = {};
driver.model = {};

$(document).ready(() => {

    comic_loader.fresh_comic_set();
    $('.ThisComicWinsBtn').click((e) => comic_loader.comic_selected(e));

});