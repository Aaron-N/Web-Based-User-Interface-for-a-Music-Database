function deleteRecordLabel(id){
    $.ajax({
        url: '/record_labels/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
