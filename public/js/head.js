$(function () {

    function headSlide() {
        $('#blinkerBox>img:eq(0)').css({display:'block'}).animate({opacity:'1'}, 1000)
            .delay(2000)
            .animate({opacity:'0'}, 1000,
        function() {
            $(this).css({display: 'none'});
            $('#blinkerBox>img:eq(1)').css({display: 'block'}).animate({opacity: '1'}, 1000)
                .delay(2000)
                .animate({opacity: '0'}, 1000,
                    function () {
                        $(this).css({display: 'none'});
                        $('#blinkerBox>img:eq(2)').css({display: 'block'}).animate({opacity: '1'}, 1000)
                            .delay(2000)
                            .animate({opacity: '0'}, 1000,
                                function () {
                                    $(this).css({display: 'none'});
                                    headSlide();
                                });
                    });
        });
    }

    headSlide();
});