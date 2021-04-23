
document.addEventListener('DOMContentLoaded', function() {
    const swiperComments = new Swiper('.comments-slider', {

        loop: true,

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },

        slidesPerView: 3,
        

        centeredSlides: true
    });

}, false);
