function comicSubmitBtnClick (e) {

    setTimeout(() => {
        show_wrapper('LoadingWrapper');

        try {
            let winning_uxID = $(e.target).parents('.ComicWrapper').attr('id');
            let losing_uxID = $(`.ComicWrapper:not(#${winning_uxID})`).attr('id');

            let vote_body = {"winner":get_comic_id(winning_uxID),"loser":get_comic_id(losing_uxID)}

            submitVote(vote_body);

        } catch (e) {
            handle_error();
        }

    }, 250);

}

function submitVote (body) {

    $.ajax({
        type:'POST',
        url: utils.get_root() + '/vote',
        data: JSON.stringify(body),
        success: () => {
            load_comic_set();          
        },
        error: () => {
            handle_error();
        }
    })

}