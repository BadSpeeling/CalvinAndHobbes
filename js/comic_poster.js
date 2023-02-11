var comic_poster = {};

//handle the post vote selection process
comic_poster.process_vote = function (container_id, did_win) {
    
    if (did_win) {
        driver.model[container_id].wins = driver.model[container_id].wins + 1; 
    }
    else {
        driver.model[container_id].losses = driver.model[container_id].losses + 1;
    }

    

}