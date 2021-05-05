// Проверка, загрузилась ли страница
$(document).ready(function () {


	AOS.init();


	$('.third__slider').slick({
		slidesToShow: 1,
		dots: true,
		centerMode: true,
		centerPadding: '30%',
		arrows: true,
		appendDots: '.dots-wrapper',
		prevArrow: '.arrow-prev',
		nextArrow: '.arrow-next',

		responsive: [
			{
				breakpoint: 769,
				settings: {
					arrows: true,
					centerMode: true,
					centerPadding: '0',
					slidesToShow: 1,
					dots: false
				}
			}
		]
	});

	$('.services-item__wrapper,.services__form').hide();
	$('.services__list').addClass('_active');

	$('.title-service').click(function (e) {
		let item = $(this);

		if (item.hasClass('title-service_not-active')) {
			item.removeClass('title-service_not-active');
			item.addClass('title-service_active');

			$('.title-service').not(item).hide(350, function () {
				setTimeout(function () {
					item.next().show(350);
				}, 300);
			});

		} else {
			item.next().hide(350, function () {
				setTimeout(function () {
					$('.title-service').not(item).show(350);
				}, 300);
			})
			item.addClass('title-service_not-active');
			item.removeClass('title-service_active');
			$('.services__list').show();
			$('.services__list').addClass('_active');
			$('.services__form').hide();
			$('.services__form').removeClass('_active');

		}

	});

	$('.services-list__item-btn').click(function () {
		$('.services__list').removeClass('_active');

		$('.services__list').fadeOut(300, function () {

			setTimeout(function () {
				$('.services__form').fadeIn(300);
				$('.services__form').addClass('_active');

			}, 350);
		})
	});

	$('.services__btn-back').click(function () {
		if ($(this).next().hasClass('_active')) {
			titleItem = $('.title-service_active');
			titleItem.next().hide(300, function () {
				setTimeout(function () {
					$('.title-service_not-active').show(300);
					titleItem.removeClass('title-service_active');
					titleItem.addClass('title-service_not-active');
				}, 350);
			})

		} else {
			$('.services__form').fadeOut(300, function () {
				setTimeout(function () {
					$('.services__list').fadeIn(300)
				}, 350);
			});
			$('.services__form').removeClass('_active');
			$('.services__list').addClass('_active');
		}

	})





});