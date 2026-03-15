const lenis = new Lenis({
    autoRaf: true,
});


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


const mobileMenu = document.querySelector('.mobile-menu');
document.addEventListener('pointerdown', (e) => {
    const target = e.target;
    if (target.closest('[data-show-modal]')) {
        e.preventDefault();
        const modalType = target.closest('[data-show-modal]').getAttribute('data-show-modal');
        console.log(modalType);
        const currentModal = document.querySelector(`[data-modal="${modalType}"]`);
        currentModal.classList.add('show');
    }

    if (target.closest('.modal-template') && !target.closest('.modal-content') || target.closest('.form-tmp__close') || target.closest('.close-modal-btn')) {
        const activeModal = target.closest('.modal-template.show');
        activeModal && activeModal.classList.remove('show');
    }

    if (target.closest('.mob-menu-btn')) {
        mobileMenu.classList.add('show');
    }

    if (target.closest('.mobile-menu__close')) {
        mobileMenu.classList.remove('show');
    }


    if (target.closest('.mobile-menu__nav .header-link')) {
        setTimeout(() => { mobileMenu.classList.remove('show'); }, 300)
    }
}, { capture: true })



function initTimer() {
    const timerContainer = document.querySelector('.timer__blocks');
    if (!timerContainer) return;

    const dateAttr = timerContainer.getAttribute('data-timer-date');
    const [day, month, year] = dateAttr.split('.').map(Number);

    const deadline = new Date(year, month - 1, day);

    const nodes = {
        days: timerContainer.querySelectorAll('.block-num')[0],
        hours: timerContainer.querySelectorAll('.block-num')[1],
        minutes: timerContainer.querySelectorAll('.block-num')[2],
        seconds: timerContainer.querySelectorAll('.block-num')[3]
    };

    function updateTimer() {
        const now = new Date();
        const diff = deadline - now;

        if (diff <= 0) {
            clearInterval(timerInterval);
            return;
        }

        // Расчеты времени
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);

        nodes.days.textContent = d.toString().padStart(2, '0');
        nodes.hours.textContent = h.toString().padStart(2, '0');
        nodes.minutes.textContent = m.toString().padStart(2, '0');
        nodes.seconds.textContent = s.toString().padStart(2, '0');
    }

    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

document.addEventListener('DOMContentLoaded', initTimer);



const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
const numericRegex = /^[0-9]+$/;


$('.form-field').on('input focus', function () {
    $(this).parent('.form-label').removeClass('error');
});

$('input[type="checkbox"]').on('change', function () {
    $(this).closest('.agree-label').removeClass('error');
});


$(document).ready(function () {

    // Обработка формы consultation
    $('[data-modal="consultation"] .submit-btn').on('click', function (e) {
        e.preventDefault();
        function setError($el, condition) {
            if (condition) {
                $el.parent('.form-label').addClass('error');
                isValid = false;
            } else {
                $el.parent('.form-label').removeClass('error');
            }
        }

        const $form = $(this).closest('.form-tmp');
        const $btn = $(this);
        let isValid = true;

        const $name = $form.find('input[name="name"]');
        const $company = $form.find('input[name="company"]');
        const $question = $form.find('textarea');

        setError($name, $name.val().trim().length < 2);
        setError($company, $company.val().trim().length < 2);
        setError($question, $question.val().trim().length < 5);

        const $email = $form.find('input[name="email"]');
        setError($email, !emailRegex.test($email.val().trim()));

        const $phone = $form.find('input[name="phone"]');
        setError($phone, !phoneRegex.test($phone.val().trim()));

        $form.find('input[type="checkbox"]').each(function () {
            const $label = $(this).closest('.agree-label');
            if (!$(this).is(':checked')) {
                $label.addClass('error');
                isValid = false;
            } else {
                $label.removeClass('error');
            }
        });

        if (!isValid) return false;

        const formData = {
            question: $question.val(),
            name: $name.val(),
            company: $company.val(),
            phone: $phone.val(),
            email: $email.val(),
        };

        console.log(formData);

        $btn.prop('disabled', true).text('Отправка...');

        $.ajax({
            url: '/ajax/consultation.php',
            method: 'POST',
            data: formData,
            success: function (response) {
                $form.find('input, textarea').val('');
                $form.find('input[type="checkbox"]').prop('checked', false);
            },
            error: function () {
                console.log('Ошибка');

            },
            complete: function () {
                $('[data-modal="consultation"]').addClass('complited');
            }
        });
    });

    //  Обработка формы application
    $('[data-modal="application"] .submit-btn').on('click', function (e) {
        e.preventDefault();

        const $form = $(this).closest('.form-tmp');
        const $btn = $(this);
        let isValid = true;

        function setError($el, condition) {
            if (condition) {
                $el.parent('.form-label').addClass('error');
                isValid = false;
            } else {
                $el.parent('.form-label').removeClass('error');
            }
        }

        const $name = $form.find('input[name="name"]');
        const $company = $form.find('input[name="company"]');
        setError($name, $name.val().trim().length < 2);
        setError($company, $company.val().trim().length < 2);

        const $count = $form.find('input[name="applications-count"]');
        setError($count, !numericRegex.test($count.val().trim()));

        const $email = $form.find('input[name="email"]');
        setError($email, !emailRegex.test($email.val().trim()));

        const $phone = $form.find('input[name="phone"]');
        setError($phone, !phoneRegex.test($phone.val().trim()));

        $form.find('input[type="checkbox"]').each(function () {
            const $label = $(this).closest('.agree-label');
            if (!$(this).is(':checked')) {
                $label.addClass('error');
                isValid = false;
            } else {
                $label.removeClass('error');
            }
        });

        if (!isValid) return false;

        const formData = {
            name: $name.val().trim(),
            company: $company.val().trim(),
            count: $count.val().trim(),
            email: $email.val().trim(),
            phone: $phone.val().trim(),
        };


        $btn.prop('disabled', true).text('Отправка...');

        $.ajax({
            url: '/ajax/application.php',
            method: 'POST',
            data: formData,
            success: function (response) {
                $form.find('input').val('');
                $form.find('input[type="checkbox"]').prop('checked', false);
            },
            error: function () {
                console.log('Ошибка');
            },
            complete: function () {
                $('[data-modal="application"]').addClass('complited');
            }
        });
    });

});


