function deleteLabelStream(id){
    $.ajax({
        url: '/label_stream/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
