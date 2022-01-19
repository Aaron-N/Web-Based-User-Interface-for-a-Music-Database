function searchAlbumsByName() {
    //get the album name 
    var album_name_search_string  = document.getElementById('album_name_search_string').value
    //construct the URL and redirect to it
    window.location = '/albums/search/' + encodeURI(album_name_search_string)
}

function searchAlbumsByArtist() {
    //get the id of the selected artist from the dropdown
    var artist_id = document.getElementById('artist_filter').value
    //construct the URL and redirect to it
    window.location = '/albums/search/' + parseInt(artist_id)
}

function searchAlbumsByRecordLabel() {
    //get the id of the selected artist from the dropdown
    var recordLabel_id = document.getElementById('recordLabel_filter').value
    //construct the URL and redirect to it
    window.location = '/albums/search/' + parseInt(recordLabel_id)
}

/*function searchAlbumsByNameArtistLabel() {
    //get the album name 
    var album_name_search_string  = document.getElementById('album_name_search_string').value
    //get the id of the selected artist from the dropdown
    var artist_id = document.getElementById('artist_filter').value
    //get the id of the selected record label from the filter dropdown
    var recordLabel_id = document.getElementById('recordLabel_filter').value
    //construct the URL and redirect to it
    window.location = '/albums/search/' + encodeURI(album_name_search_string) + '/' + parseInt(artist_id) + '/' + parseInt(recordLabel_id)
}*/
