"use strict";
;
var Video = document.getElementById("videoZone");
quit === null || quit === void 0 ? void 0 : quit.addEventListener("click", function (e) {
    Video === null || Video === void 0 ? void 0 : Video.innerHTML = "";
});
var App = function () {
    var media2append = appendMedia(movies);
    console.log(media2append);
    insertMedia(app, media2append);
};
function appendMedia(arreglo) {
    var cook = "";
    for (var i = 0; i < arreglo.length; i++) {
        var currentMovie = arreglo[i];
        cook += "<div class='item' onclick='play(" + i + ", movies)' id='" + i + "'><p>" + currentMovie.name + "</p> </div>";
    }
    return cook
}
function insertMedia(Object, media) {
    Object.innerHTML = media;
}
function play(id, mediaArray) {
    for (var i = 0; i < mediaArray.length; i++) {
        if (i === id) {
            insertMedia(Video, "<video src='" + mediaArray[id].server + "'controls autoplay></video>");
        }
    }
}
var debug = false;
App();
