function filterAlbumsByRecordLabel() {
    //get the id of the selected record label from the filter dropdown
    var recordLabel_id = document.getElementById('recordLabel_filter').value
    //construct the URL and redirect to it
    window.location = '/albums/filter/' + parseInt(recordLabel_id)
}

function filterAlbumsByArtist() {
    //get the id of the selected artist from the filter dropdown
    var artist_id = document.getElementById('artist_filter').value
    //construct the URL and redirect to it
    window.location = '/albums/filter/' + parseInt(artist_id)
}