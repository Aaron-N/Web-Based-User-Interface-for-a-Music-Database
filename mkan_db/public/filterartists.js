function filterArtistsByRecordLabel() {
    //get the id of the selected record label from the filter dropdown
    var recordLabel_id = document.getElementById('recordLabel_filter').value
    //construct the URL and redirect to it
    window.location = '/artists/filter/' + parseInt(recordLabel_id)
}
