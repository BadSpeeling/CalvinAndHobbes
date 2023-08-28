function comicSubmitBtnClick (e) {

    let winning_uxID = $(e.target).parents('.ComicWrapper').attr('id');
    let losing_uxID = $(`.ComicWrapper:not(#${winning_uxID})`).attr('id');

    let vote_body = {"winner":driver.model.get_comic_id(winning_uxID),"loser":driver.model.get_comic_id(losing_uxID)}

    submitVote(vote_body);

}

function submitVote (body) {

    $.ajax({
        type:'POST',
        url:'http://localhost:3000/vote',
        data: JSON.stringify(body),
        success: () => {

            $('#ComicsWrapper').slideToggle('fast');
            reset_model('comic1');
            reset_model('comic2');

            load_comic_set();
            
        }
    })

}