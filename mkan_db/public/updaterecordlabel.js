/*function updateRecordLabel(id) {
   
    window.location = '/record_labels/update/' + id
}*/

function updateRecordLabel(id){
    $.ajax({
        url: '/record_labels/' + id,
        type: 'PUT',
        data: $('#update-record_label').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};