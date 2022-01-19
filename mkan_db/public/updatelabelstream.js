function updateLabelStream(id){
    $.ajax({
        url: '/label_stream/' + id,
        type: 'PUT',
        data: $('#update-label_stream').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};