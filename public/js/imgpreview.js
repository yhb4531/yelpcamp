function previewMultiple(evt) {
    var img = document.getElementById("image");
    var count = img.files.length;
    for (i = 0; i < count; i++) {
        var urls = URL.createObjectURL(evt.target.files[i]);
        document.getElementById("formFile").innerHTML += '<img src="' + urls + '">';
    }
}