// $( document ).ready(function() {
//     $('.ThisComicWinsBtn').click(function(e) {

//         //$.post("http://localhost:3000/vote", {"winner":"ch851118.gif","loser":"ch951231.gif"})

//         $.get('http://localhost:3000/comic?comic_id=851118', () => {

//         });

//         // $.get('http://localhost:3000/comic', (comic_result) => {
            
//         //     comic_result = JSON.parse(comic_result);
//         //     comic_result.date = new Date(comic_result.date);

//         //     var comicWrapper = $(e.target).parents('.ComicWrapper');
//         //     var infoWrapper = comicWrapper.find('.InfoWrapper');

//         //     comicWrapper.find('.ImgWrapper img').attr({'src':comic_result.url});
//         //     infoWrapper.find('.ComicDateValue').text(utils.pretty_date(comic_result.date));
//         //     infoWrapper.find('.WinsValue').text(comic_result.votes.wins);
//         //     infoWrapper.find('.WinPercentageValue').text(utils.pretty_percent(comic_result.votes));

//         // })

//     });
// });

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setUTCDate(date.getUTCDate() + days);
    return date;
}

let info = {};
info.start_date = new Date('1985-11-18');
info.end_date = new Date('1995-12-31');

function get_comic(container_id) {

    function checkImage () {
        return new Promise ((resolve,reject) => {

            let cur_date = generate_random_date();

            var img = new Image();
            img.onload = () => {resolve(cur_date)};
            img.onerror = reject;
            img.src = generate_comic_url(cur_date);

        });
    }

    checkImage()
            .then((date) => {
                $.get(utils.get_root() + '/comic?comic_id='+get_comic_id(date), (comic_result) => {
                        
                    comic_result = JSON.parse(comic_result);
                    comic_result.date = new Date(comic_result.date);

                    display_comic(container_id, comic_result);

                });
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {});
    
}

function generate_random_date () {
  
    var days_diff = (info.end_date - info.start_date)/ (1000 * 60 * 60 * 24) + 1;
    var cur_date = new Date(info.start_date);
    return cur_date.addDays(Math.random() * days_diff);
    
}

//get the file name based on a date for the hosting service
function generate_comic_url (date) {

    let comic_id = get_comic_id(date);
    
    let file_name = "ch" + comic_id + ".gif";
    return `http://picayune.uclick.com/comics/ch/19${comic_id.substring(0,2)}/${file_name}`;

}

function dates_are_equal (date1, date2) {
    return date1.getUTCDate() == date2.getUTCDate() && date1.getUTCMonth() == date2.getUTCMonth() && date1.getUTCYear() == date2.getUTCYear();
}

// let comics = [];

// let attemptCheckImage = () => {
//     checkImage()
//         .then((date) => {

//             attempts_done += 1;
//             comics.push(date);
    
//             if (comics.length == 2) {
//                 process_dates(comics);
//             }
//             else if (attempts_done < max_attempts) {
//                 attemptCheckImage();
//             }
    
//         })
//         .catch(() => {
//             attempts_done += 1;
//             if (attempts_done < max_attempts) {
//                 attemptCheckImage();
//             }
//             else {
//                 //what do we do if we failed on the last lookup attempt
//             }
//         })
//         .finally(() => {});
// }

// attemptCheckImage();
