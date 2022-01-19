function searchLabelStreamsByRecordLabel() {
    //get the id of the selected record label from the filter dropdown
    var recordLabel_id = document.getElementById('recordLabel_filter').value
    //construct the URL and redirect to it
    window.location = '/label_stream/search/' + parseInt(recordLabel_id)
}

function searchLabelStreamsByStreamingService() {
    //get the id of the selected streaming service from the filter dropdown
    var streamingService_id = document.getElementById('streamingService_filter').value
    //construct the URL and redirect to it
    window.location = '/label_stream/search/' + parseInt(streamingService_id)
}

/*function searchLabelStreamByServiceLabel() {
    //get the id of the selected streaming service from the dropdown
    var streaming_service_id  = document.getElementById('streamingService_filter').value
    //get the id of the selected record label from the filter dropdown
    var recordLabel_id = document.getElementById('recordLabel_filter').value
    //construct the URL and redirect to it
    window.location = '/label_stream/search/' + parseInt(streaming_service_id) + '/' + parseInt(recordLabel_id)
}*/
