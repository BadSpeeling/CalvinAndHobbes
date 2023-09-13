var utils = {}

utils.pretty_date = function (date) {
    return `${date.getUTCMonth()+1}/${date.getUTCDate()}/${date.getUTCFullYear()}`;
}

utils.pretty_percent = function (comic_model) {

    var ret = "";

    //make sure we aren't dividing by 0
    if ((comic_model.wins + comic_model.losses) == 0) {
         ret = '0%';   
    }
    else {
        var wins_percent = (100 * (comic_model.wins / (comic_model.wins + comic_model.losses)))
        ret = Math.round(wins_percent) + '%';
    }

    return ret;

}

utils.get_root = function () {
    return window.location.origin + (window.location.port ? "" : ":" + window.location.port);
}