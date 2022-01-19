function updateArtist(id){
    $.ajax({
        url: '/artists/' + id,
        type: 'PUT',
        data: $('#update-artist').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};