function filterLabelStreamsByRecordLabel() {
    //get the id of the selected record label from the filter dropdown
    var recordLabel_id = document.getElementById('recordLabel_filter').value
    //construct the URL and redirect to it
    window.location = '/label_stream/filter/' + parseInt(recordLabel_id)
}

function filterLabelStreamsByStreamingService() {
    //get the id of the selected streaming service from the filter dropdown
    var streamingService_id = document.getElementById('streamingService_filter').value
    //construct the URL and redirect to it
    window.location = '/label_stream/filter/' + parseInt(streamingService_id)
}