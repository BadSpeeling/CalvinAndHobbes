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
            $.ajax(
                {
                    type:'GET',
                    url: utils.get_root() + '/comic?comic_id='+parse_comic_id(date), 
                    success:(comic_result) => {
                    
                        comic_result = JSON.parse(comic_result);
                        comic_result.date = new Date(comic_result.date);

                        set_comics(container_id, comic_result);

                    },
                    error:() => {
                        handle_error();
                    }
                }
            );
        })
        .catch((err) => {
            handle_error();
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

    let comic_id = parse_comic_id(date);
    
    let file_name = "ch" + comic_id + ".gif";
    return `http://picayune.uclick.com/comics/ch/19${comic_id.substring(0,2)}/${file_name}`;

}