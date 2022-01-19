function updateAlbum(id){
    $.ajax({
        url: '/albums/' + id,
        type: 'PUT',
        data: $('#update-album').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};