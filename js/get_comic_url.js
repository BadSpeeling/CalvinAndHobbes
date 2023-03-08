$( document ).ready(function() {
    $('.ThisComicWinsBtn').click(function(e) {

        $.get('http://localhost:3000/comic', (comic_result) => {
            
            comic_result = JSON.parse(comic_result);
            comic_result.date = new Date(comic_result.date);

            var comicWrapper = $(e.target).parents('.ComicWrapper');
            var infoWrapper = comicWrapper.find('.InfoWrapper');

            comicWrapper.find('.ImgWrapper img').attr({'src':comic_result.url});
            infoWrapper.find('.ComicDateValue').text(utils.pretty_date(comic_result.date));
            infoWrapper.find('.WinsValue').text(comic_result.votes.wins);
            infoWrapper.find('.WinPercentageValue').text(utils.pretty_percent(comic_result.votes));

        })
    });
});