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



document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.closest('[data-show-modal]')) {
        e.preventDefault()
        const modalType = target.closest('[data-show-modal]').getAttribute('data-show-modal');
        console.log(modalType);
        const currentModal = document.querySelector(`[data-modal="${modalType}"]`);
        currentModal.classList.add('show');
    }

    if (target.closest('.modal-template') && !target.closest('.modal-content') || target.closest('.form-tmp__close')) {
        const activeModal = target.closest('.modal-template.show');
        activeModal && activeModal.classList.remove('show');
    }
})