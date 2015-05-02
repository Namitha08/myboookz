$(document).ready(function() {
    $('#grimportmodalbtnYes').click(function() {
        alert("data import called!!!");
        window.location = "/auth/goodreads";
    });

    $('.scrollClick').click(function(e){
        e.preventDefault();
        scrollToElement( $(this).attr('scroll-to-id'), 600 );
    });

    var scrollToElement = function(el, ms){
        var speed = (ms) ? ms : 600;
        $('html,body').animate({
            scrollTop: $(el).offset().top
        }, speed);
    };

    $("#address-add-save").on("click", function(event) {
        event.preventDefault();
        var params = {address: {type: $('#address-add-type').val(), latitude: $('#address-add-lat').val(), longitude: $('#address-add-long').val(), landmark: $('#address-add-landmark').val()}};
        var str = jQuery.param( params );
        console.log(str);
        var posting = $.post('api/address', str,"application/json");
        posting.done(function(data){
            //add the stuff back to
        })
    });

    $("#my-books-tab-wishlist").on("click", function(event) {
        event.preventDefault();
        var posting = $.get('api/wishlist');
        posting.done(function(data){
            console.log(data)
            $('#my-books-tab-wishlist-content-div').replaceWith(data)
        })
    });

    $("#my-books-tab-owned").on("click", function(event) {
        event.preventDefault();
        var posting = $.get('api/ownedBooks');
        posting.done(function(data){
            $("#")
        })
    });
    
    $(".fbLikePopUp").on("click", function(event){
        event.preventDefault();
        alert("recommend him fb page")
    })
});
