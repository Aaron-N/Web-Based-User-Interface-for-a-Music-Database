function searchStreamingServicesByName() {
    //get the streaming service name 
    var service_name_search_string  = document.getElementById('service_name_search_string').value
    //construct the URL and redirect to it
    window.location = '/streaming_services/search/' + encodeURI(service_name_search_string)
}
