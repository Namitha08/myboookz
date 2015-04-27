$('#address-info-#{addresses[i].id}-edit-cancel-button').click(function(){$('.address-info-#{addresses[i].id}-edit').hide("slow");});
$('#address-info-edit-#{addresses[i].id}-button').click(function(){$('.address-info-#{addresses[i].id}-edit').show()});
$('#address-info-#{addresses[i].id}-edit-save-button').click(function(){
    $("#address-add-save").on("click", function(event) {
        event.preventDefault();
        var params = {address: {type: $('#address-add-type').val(), latitude: $('#address--#{addresses[i].id}-edit-lat').val(), longitude: $('#address--#{addresses[i].id}-edit-long').val(), landmark: $('#address-#{addresses[i].id}-edit-landmark').val()}};
        var str = jQuery.param( params );
        console.log(str);
        var posting = $.put('api/address', str,"application/json");
        posting.done(function(data){

            
        })
    });
});