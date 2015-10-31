function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(null, xmlHttp.responseText);
        }
        else {
            callback(new Error(xmlHttp.statusText), xmlHttp.responseText)
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

var scriptTags = document.getElementsByTagName('script');
var scriptTag = scriptTags[0];

var div = document.createElement('div');

    // add a style tag to the head

// add array index of for rubbish browsers (IE<9)
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj, start) {
        var i, j;
        i = start || 0;
        j = this.length;
        while (i < j) {
            if (this[i] === obj) {
                return i;
            }
            i++;
        }
        return -1;
    };
}

var MYLIBRARY = MYLIBRARY;
google_id = MYLIBRARY[0];
row_id = MYLIBRARY[1];


var styleTag = document.createElement("link");
styleTag.rel = "stylesheet";
styleTag.type = "text/css";
styleTag.href = 'fact_style.css';
styleTag.media = "all";

//document.lastChild.firstChild.appendChild(styleTag);
document.getElementsByTagName('head')[0].appendChild(styleTag);

httpGetAsync("https://spreadsheets.google.com/feeds/list/" + google_id + "/od6/public/values?alt=json-in-script&callback=listEntries",
    function (error, response) {
        if (error == null) {
            processed_json = response.substring(response.indexOf('{'), response.length - 2);
            json_obj = JSON.parse(processed_json);
            title = json_obj.feed.entry[row_id].gsx$fact.$t;
            rating = json_obj.feed.entry[row_id].gsx$rating.$t;
            speaker = json_obj.feed.entry[row_id].gsx$speaker.$t;
            logo_image = json_obj.feed.entry[1].gsx$logoimage.$t;
            rating_image = json_obj.feed.entry[row_id].gsx$ratingimage.$t;
            rating_text = json_obj.feed.entry[row_id].gsx$ratingtext.$t;
            rating_description = json_obj.feed.entry[row_id].gsx$ratingdescription.$t;
        }
        else {
            title = "Error retrieving title";
            rating = "Error recieving rating";
            speaker = "Error recieving speaker";
            logo_image = "";
            rating_image = "";
            rating_text = "";
            rating_description = "";
        }

        scriptTag.parentNode.insertBefore(div, scriptTag);
        if (rating_text != "") {
            rating_text_with_label = 'Rating: ' + rating_text;
        }
        else if (rating_description != "") {
            rating_text_with_label = 'Rating: ' + rating_description;
        }
        else { rating_text_with_label = '';}

        div.innerHTML = '<div class=\"factbox\">\n' +
            '<div class=\"image logo\"><img src=\"' + logo_image + '\" alt=\"Rater\"><\/div>' +
            '<div class=\"fact\"> <div class=\"fact-text\">\n   "' + title + '"<\/div>' +
            '<div class=\"fact-speaker\"> -' + speaker + '<\/div>' +
            '\n<div class=\"fact-rating\">\n <h2>' + rating_text_with_label + '<\/h2> <\/div><\/div>' +
            '<div class=\"image rating-image\"><img src=\"' + rating_image + '\" alt=\"Rating\"><\/div>' +
            '\n<\/div>\n\n';

    });

