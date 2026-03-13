const juriSlider = new Swiper('.juri-slider', {
    slidesPerView: 'auto',
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
        dynamicBullets: true
    },
});




$(".faq-item__head").on("click", function () {
    const toggleBody = $(this).parent('.faq-item').find('.faq-item__body');
    $(this).toggleClass('open')
    toggleBody.slideToggle("slow", function () {

    });
});