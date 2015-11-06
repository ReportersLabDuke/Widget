function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(null, xmlHttp.responseText);
        }
        else if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
            callback(new Error(xmlHttp.statusText), xmlHttp.responseText)
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

var scriptTags = document.getElementsByTagName('script');
var scriptTag = scriptTags[0];

//var me = document.currentScript.getAttribute('id');

//var insert_div = document.createElement('div');

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


var styleTag = document.createElement("link");
styleTag.rel = "stylesheet";
styleTag.type = "text/css";
styleTag.href = 'fact_style.css';
styleTag.media = "all";

//document.lastChild.firstChild.appendChild(styleTag);
document.getElementsByTagName('head')[0].appendChild(styleTag);
[].forEach.call(document.querySelectorAll('[data-sheet]'), function (insert_div) {
    sheet = insert_div.attributes['data-sheet'].value;
    row = parseInt(insert_div.attributes['data-row'].value, 10);
    createHtml(sheet, row, insert_div);
});


function showEmbed(e) {
    var target = e;
    factbox = target.parentNode.parentNode;
    factbox.getElementsByClassName('embed-box')[0].style.display = 'block';
}


function createHtml (google_id, row_id, div) {
    httpGetAsync("https://spreadsheets.google.com/feeds/list/" + google_id + "/od6/public/values?alt=json-in-script&callback=listEntries",
        function (error, response) {
            if (error == null) {
                processed_json = response.substring(response.indexOf('{'), response.length - 2);
                json_obj = JSON.parse(processed_json);
                title = json_obj.feed.entry[row_id].gsx$fact.$t;
                rating = json_obj.feed.entry[row_id].gsx$rating.$t;
                speaker = json_obj.feed.entry[row_id].gsx$speaker.$t;
                logo_image = json_obj.feed.entry[0].gsx$logoimage.$t;
                speaker_image = json_obj.feed.entry[row_id].gsx$speakerimage.$t;
                rating_image = json_obj.feed.entry[row_id].gsx$ratingimage.$t;
                rating_text = json_obj.feed.entry[row_id].gsx$ratingtext.$t;
                rating_description = json_obj.feed.entry[row_id].gsx$ratingdescription.$t;
            }
            else {
                title = "Error retrieving title";
                rating = "Error recieving rating";
                speaker = "Error recieving speaker";
                logo_image = "";
                speaker_image = "";
                rating_image = "";
                rating_text = "";
                rating_description = "";
            }

            //scriptTag.parentNode.insertBefore(div, scriptTag);
            if (rating_text != "") {
                rating_text_with_label = '<h2>Rating: ' + rating_text + '<\/h2>';
                rating_summary = '<img src=\"' + rating_image + '\" alt=\"Rating\">'
            }
            else if (rating_description != "") {
                rating_summary = '<h3>Rating: ' + rating_description + '<\/h3>';
                rating_text_with_label = '';
            }
            else { rating_text_with_label = ''; }

            embed_text = "<script type=\"text\/javascript\" id=\"dclg-impact-indicators-embedder-5b8cf3a4-b0f0-13e9-3737-d5a159268ae6\" class=\"dclg-impact-indicators-async-script-loader\">\nMYLIBRARY = [\"1WBbJsFCGfLqylMMUKFnswcNtYNWML2InfC8GxKAeweQ\", 1];\nvar s = document.createElement('script');\ns.type = 'text\/javascript';\ns.async = true;\ns.src = 'fact_widget.js';\nvar embedder = document.getElementById('test');\nembedder.parentNode.insertBefore(s, embedder);<\/script>"

            div.innerHTML = '<div class=\"factbox\">\n' +
                '<div class=\"left-box container\"><img class=\"image logo\" src=\"' + logo_image + '\" alt=\"Rater\">' +
                '<img class=\"image speaker\" src=\"' + speaker_image + '\" alt=\"Speaker\"><\/div>' +
                '<div class=\"fact container\"> <div class=\"fact-text\">\n   ' + title + '<\/div>' +
                '<div class=\"fact-speaker\"> -' + speaker + '<\/div>' +
                '\n<div class=\"fact-rating\">\n ' + rating_text_with_label + ' <\/div><\/div>' +
                '<div class=\"right-box container\">' + rating_summary +  '<a class=\"subtext\" href=\"#\" onclick=\"showEmbed(this)\">embed this<\/a><\/div>' +
                '\n' +
                '<div class=\"embed-box\"><p>Copy and paste this embed code into your site:<\/p><textarea rows=\"4\" cols=\"50\">' + embed_text + '<\/textarea><\/div><\/div>\n\n';

        });
};

