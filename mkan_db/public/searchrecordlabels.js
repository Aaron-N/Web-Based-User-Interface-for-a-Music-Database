function searchRecordLabelsByName() {
    //get the record label name 
    var label_name_search_string  = document.getElementById('label_name_search_string').value
    //construct the URL and redirect to it
    window.location = '/record_labels/search/' + encodeURI(label_name_search_string)
}
