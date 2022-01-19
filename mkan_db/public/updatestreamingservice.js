function updateStreamingService(id){
    $.ajax({
        url: '/streaming_services/' + id,
        type: 'PUT',
        data: $('#update-streaming_service').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};