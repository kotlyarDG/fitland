// Проверка, загрузилась ли страница
$(document).ready(function () {

	$('.scroll-link').click(function (e) {
		let blockId = $(this).attr('href');
		$('html, body').animate({
			scrollTop: $(blockId).offset().top
		}, 'slow');
		$('.header__burger,.burger__menu,.header').removeClass('_active');
		$('body').removeClass('_lock');

		e.preventDefault();
	})

	const section = $('.section'),
		nav = $('.menu'),
		navHeight = nav.outerHeight(); // получаем высоту навигации 

	// поворот экрана 
	window.addEventListener('orientationchange', function () {
		navHeight = nav.outerHeight();
	}, false);

	$(window).on('scroll', function () {
		const position = $(this).scrollTop();

		section.each(function () {
			const top = $(this).offset().top - navHeight - 155,
				bottom = top + $(this).outerHeight();

			if (position >= top && position <= bottom) {
				nav.find('a').removeClass('active');
				section.removeClass('active');

				$(this).addClass('active');
				nav.find('a[href="#' + $(this).attr('id') + '"]').addClass('active');
			}
		});
	});

	$('.trainer-popup-link').click(function (e) {
		$('#trainer-popup').addClass('open');
		e.preventDefault();
	});

	$('#trainer-popup').click(function (e) {
		if (!e.target.closest('.popup__content')) {
			$('#trainer-popup').removeClass('open');
		}
	});

	$('#trainer-popup').find('.close-popup').click(function (e) {
		console.log('news close')
		$('#trainer-popup').removeClass('open');
		e.preventDefault();
	})

	$('#link-first').click(function () {
		$('#first-popup').addClass('open');
	});

	$('.close-popup').click(function () {
		$('#first-popup').removeClass('open');

	})

	$('#first-popup').click(function (e) {
		if (!e.target.closest('.popup__content')) {
			$('#first-popup').removeClass('open');
		}
	});

	$('.header__burger').click(function (event) {
		$('.header__burger,.burger__menu,.header').toggleClass('_active')
		$('body').toggleClass('_lock');
	});
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

			if ($(window).width() < 992) {
				item.next().slideDown(350);
				$('.services-item__wrapper').not(item.next()).slideUp(350);
				$('.title-service').not(item).removeClass('title-service_active');
				$('.title-service').not(item).addClass('title-service_not-active');

			} else {
				$('.services__title').hide(300);
				$('.title-service').not(item).hide(350, function () {
					setTimeout(function () {
						item.next().show(350);
					}, 300);
				});
			}



		} else {
			if ($(window).width() < 992) {
				item.next().slideUp(350);
			} else {
				item.next().hide(350, function () {
					setTimeout(function () {
						$('.title-service').not(item).show(350);
						$('.services__title').show(350);
					}, 300);
				})
			}

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
					$('.services__title').show(300);
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


	$('.promotions__items').slick({
		arrows: true,
		dots: true
	})

	$('.trainers-big').slick({
		arrows: false,
		dots: false,
		asNavFor: '.trainers-small'

	})


	$('.trainers-small').slick({
		arrows: false,
		dots: false,
		slidesToShow: 1,
		centerMode: true,
		infinite: true,
		centerPadding: '40%',
		focusOnSelect: true,
		asNavFor: '.trainers-big',

		responsive: [
			{
				breakpoint: 769,
				settings: {
					centerPadding: '35%',

				}
			}
		]
	})


	let options = { videoId: 'HQfF5XRVXjU' };

	setTimeout(function () {
		$("#bgndVideo").YTPlayer();

	}, 1500);

	getNews();
});

function getNews() {
	$.ajax({
		type: "GET",
		url: 'https://termoland.herokuapp.com/v1/news/list',
		success: function (data) {
			console.log("News = ", data)

			News = data;

			for (let item of News) {
				if (item['id'] == 1) {
					$("#news__row-1").append(
						`<div class="news__item item-news item-news--big">
						<div class="item-news__img">
							<img src="${item['image']}" alt="">
						</div>
						<div class="item-news__body item-news__body--big">
							<p class="item-news__title popup-news-link" data-id="${item['id']}">${item['name']}</p>

							<p class="item-news__text item-news__text--big">${item['text']}</p>
							<p class="item-news__big-link popup-news-link" data-id="${item['id']}">*читать еще*</p>
						</div>
					</div>`
					);
				} else {
					$("#news__row-2").append(
						`<div class="news__item item-news">
						<div class="item-news__img">
							<img src="${item['image']}" alt="">
						</div>
						<div class="item-news__body">
							<p class="item-news__title popup-news-link" data-id="${item['id']}">${item['name']}</p>

							<p class="item-news__text">${item['text']}</p>
						</div>
					</div>`
					);
				}
			}

			if ($(window).width() > 1336) {

				$('.popup-news-link').click(function (e) {
					let newsId = $(this).data('id');
					let newsItem = News.find(el => el.id == newsId);
					openNewsModal(newsItem);
					e.preventDefault();
				})

			} else {
				$('.item-news__title').click(function (event) {
					$('.item-news__title').not($(this)).removeClass('_active');
					$('.item-news__text').not($(this).next()).slideUp(500);

					$(this).toggleClass('_active').next().slideToggle(500);
				});
			}
		},
		error: function (errMsg) {
			console.log("Error: ", errMsg)
		},
		contentType: "application/json; charset=utf-8",
		dataType: "json",
	});
}

function openNewsModal(newsItem) {
	console.log("Open new = ", newsItem);
	// $('#news-popup-img').attr('src', newsItem.image);
	// $('#news-popup-title').html(newsItem.name);
	// $('#news-popup-description').html(newsItem.text);

	$('#news-popup-content').html(
		`
		<img class="img-close-popup close-popup" src="images/system_img/close-popup.png" alt="">
				<div class="popup__block">
					<h2 id="news-popup-title" class="popup__title">${newsItem.name}</h2>
					<div class="popup__body">
						<div class="popup__img">
							<img id="news-popup-img" src="${newsItem.image}" alt="">
						</div>
						<div class="popup__info">
							<p id="news-popup-description">${newsItem.text}</p>
						</div>
					</div>
					<a href="#" class="popup__btn btn close-popup">Закрыть</a>
				</div>
		`
	);
	$('#news-popup').addClass('open');
	// $(body).addClass('_lock');



	$('#news-popup').click(function (e) {
		if (!e.target.closest('.popup__content')) {
			$('#news-popup').removeClass('open');
		}
	});

	$('#news-popup').find('.close-popup').click(function (e) {
		console.log('news close')
		$('#news-popup').removeClass('open');
		e.preventDefault();
	})
}