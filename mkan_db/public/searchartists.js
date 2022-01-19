function searchArtistsByName() {
    //get the artist name 
    var artist_name_search_string  = document.getElementById('artist_name_search_string').value
    //construct the URL and redirect to it
    window.location = '/artists/search/' + encodeURI(artist_name_search_string)
}

function searchArtistsByRecordLabel() {
    //get the id of the selected record label from the filter dropdown
    var recordLabel_id = document.getElementById('recordLabel_filter').value
    //construct the URL and redirect to it
    window.location = '/artists/search/' + parseInt(recordLabel_id)
}

/*function searchArtistsByNameRecordLabel() {
    //get the artist name 
    var artist_name_search_string  = document.getElementById('artist_name_search_string').value
    //get the id of the selected record label from the filter dropdown
    var recordLabel_id = document.getElementById('recordLabel_filter').value
    //construct the URL and redirect to it
    window.location = '/artists/search/' + encodeURI(artist_name_search_string) + '/' + parseInt(recordLabel_id)
}*/
