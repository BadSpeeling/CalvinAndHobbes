function comicSubmitBtnClick (e) {

    let winning_uxID = $(e.target).parents('.ComicWrapper').attr('id');
    let losing_uxID = $(`.ComicWrapper:not(#${winning_uxID})`).attr('id');

    $('#ComicsWrapper').slideToggle('fast');
    reset_model('comic1');
    reset_model('comic2');

    submitVote({"winner":driver.model[winning_uxID],"loser":driver.model[losing_uxID]});

}

function submitVote (body) {

    $.ajax({
        type:'POST',
        url:'http://localhost:3000/vote',
        data: JSON.stringify(body),
        success: () => {
            load_comic_set();
        }
    })

}