function deleteStreamingService(id){
    $.ajax({
        url: '/streaming_services/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
