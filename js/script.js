// Проверка, загрузилась ли страница
const serverUrl = 'https://www.landback.site/fitland';

$(document).ready(function () {

	getPromotions();
	getTrainers();
	getTickets();
	getClass();
	getPersonals();
	getAdditionals();
	getNews();

	ymaps.ready(function () {
		console.log('map init');
		var myMap = new ymaps.Map("map", {
			center: [55.782546568956114, 37.58127150000001],
			zoom: 17
		});
	});

	$('.scroll-link').click(function (e) {
		let blockId = $(this).attr('href');
		$('html, body').animate({
			scrollTop: $(blockId).offset().top - 100
		}, 'slow');
		$('.header__burger,.burger__menu,.header').removeClass('_active');
		$('body').removeClass('_lock');

		e.preventDefault();
	})

	const section = $('.section'),
		nav = $('.menu');
	let navHeight = nav.outerHeight(); // получаем высоту навигации 

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






	$('#link-first').click(function () {
		$('#first-popup').addClass('open');
	});

	$('.close-popup').click(function () {
		$('#first-popup').removeClass('open');
		$('#order-popup').removeClass('open');
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

	$('.try-train__form').submit(function (e) {

		let data = {
			'client_name': $('#try-name').val(),
			'phone': $('#try-tel').val()
		}
		console.log(data);
		sendOrder(data, 'abonement');

		e.preventDefault();
	})


	setTimeout(function () {
		$("#bgndVideo").YTPlayer();

	}, 1500);

});

function getTrainers() {

	$.ajax({
		type: "GET",
		url: `${serverUrl}/trainers`,
		success: function (data) {
			console.log(data);
			let trainers = data;

			for (let trainer of trainers) {
				$('.trainers-big').append(
					`
					<div class="item-big">
								<div class="item-big__img"
									style="background: #E7DCC9 ${trainer['photo']} center / cover no-repeat;">
								</div>
								<div class="item-big__body">
									<p class="item-big__name">${trainer['fullname']}</p>
									<p class="item-big__text">${trainer['description']}</p>
									<a data-id="${trainer['id']}" href="trainer-popup" class="item-big__btn trainer-popup-link">ЗАПИСАТЬСЯ</a>
								</div>
							</div>
					`
				);
				$('.trainers-small').append(
					`
					<div class="item-small"
								style="background: ${trainer['photo']} center / cover no-repeat;"></div>
					`
				);
			}

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

			$('.trainer-popup-link').click(function (e) {
				openTrainerModal(trainers.find(x => x.id == $(this).data('id')));
				e.preventDefault();
			});
		},
		error: function (errMsg) {
			console.log("Error: ", errMsg)
		},
		contentType: "application/json; charset=utf-8",
		dataType: "json",
	});




}

function openTrainerModal(trainer) {

	console.log('open trainer modal');
	console.log(trainer);

	$('#trainer-popup').find('.popup__block').html(
		`
		<div class="popup-trainer__close close-popup">
		<img src="images/system_img/close-popup-brown.png" alt="">
	</div>
	<h2 id="traier-popup-title" class="popup__trainer-title">${trainer['fullname']}</h2>
	<img src=${trainer['photo']} alt="" class="popup__img-traier">
	<p class="popup__text-trainer">оставьте свои данные</p>
	<form>
	<input type="text" id="train-name" class="try-train__input" placeholder="ФИО" required>
	<input type="tel" id="train-tel" class="try-train__input" placeholder="Номер телефона" required>
	<button type="submit" class="try-train__btn">ЗАПИСАТЬСЯ</button>
	</form>
	
		`
	)

	$('#trainer-popup').find('form').submit(function (e) {

		let data = {
			'client_name': $('#train-name').val(),
			'phone': $('#train-tel').val(),
			'trainer_name': trainer['fullname']
		}
		console.log(data);
		sendOrder(data, 'personal');

		e.preventDefault();
	})

	$('#trainer-popup').addClass('open');

	$('#trainer-popup').click(function (e) {
		if (!e.target.closest('.popup__content')) {
			$('#trainer-popup').removeClass('open');
		}
	});

	$('#trainer-popup').find('.close-popup').click(function (e) {
		console.log('trainer close')
		$('#trainer-popup').removeClass('open');
		e.preventDefault();
	});

}

function getTickets() {

	$.ajax({
		type: "GET",
		url: `${serverUrl}/aboniments`,
		success: function (data) {
			let tickets = data;

			for (let item of tickets) {
				$('.services__list--tickets').find('.services-list__items').append(
					`
					<div class="services-list__item">
										<div class="services-list__item-left">
											<p class="services-list__item-title">${item['title']}</p>
											<p class="services-list__item-subtitle">${item['description']}</p>
										</div>
										<div class="services-list__item-right">
											<p class="services-list__item-price">${item['price']} р.</p>
											<button data-id="${item['id']}" class="services-list__item-btn">заказать</button>
										</div>
									</div>
					`
				);

			};

			$('.services__list--tickets').find('.services-list__item-btn').click(function () {
				openFormTicket(tickets.find(x => x.id == $(this).data('id')));
			})
		},
		error: function (errMsg) {
			console.log("Error: ", errMsg)
		},
		contentType: "application/json; charset=utf-8",
		dataType: "json",
	});



}

function openFormTicket(item) {

	$('.services__list').removeClass('_active');
	$('.services__form--tickets').html(
		`
			<form>
							<div class="services-form__input-wrapper">
								<label for="input-fio-1" class="services-form__label">ФИО</label>
								<input type="text" id="input-fio-1" class="services-form__input" placeholder="ФИО" required>
							</div>
							<div class="services-form__input-wrapper services-form__input-wrapper--tel">
								<label for="input-phone-1" class="services-form__label">Номер телефона</label>
								<input type="tel" id="input-phone-1" class="services-form__input" placeholder="Номер телефона" required>
							</div>
							<button class="services-form__btn" type="submit">отправить заявку</button>
						</form>
			`
	);

	$()
	$('.services__list').fadeOut(300, function () {

		setTimeout(function () {
			$('.services__form').fadeIn(300);
			$('.services__form').addClass('_active');

		}, 350);
	})
	$('.services__form--tickets').find('form').submit(function (e) {
		console.log(item);
		let data = {
			'client_name': $('#input-fio-1').val(),
			'phone': $('#input-phone-1').val()
		}
		console.log(data);
		sendOrder(data, 'abonement');

		e.preventDefault();
	})
}

function getClass() {

	$.ajax({
		type: "GET",
		url: `${serverUrl}/comm_classes`,
		success: function (data) {
			console.log(data);
			let classes = data;
			for (let item of classes) {
				$('.services__list--class').find('.services-list__items').append(
					`
					<div class="services-list__item">
										<div class="services-list__item-left">
											<p class="services-list__item-title">${item['title']}</p>
											<p class="services-list__item-subtitle">${item['description']}</p>
										</div>
										<div class="services-list__item-right">
											<p class="services-list__item-price">${item['price']} р.</p>
											<button data-id="${item['id']}" class="services-list__item-btn">заказать</button>
										</div>
									</div>
					`
				);

			};

			$('.services__list--class').find('.services-list__item-btn').click(function () {
				openFormClass(classes.find(x => x.id == $(this).data('id')));
			})

		},
		error: function (errMsg) {
			console.log("Error: ", errMsg)
		},
		contentType: "application/json; charset=utf-8",
		dataType: "json",
	});

}

function openFormClass(item) {

	$('.services__list').removeClass('_active');
	$('.services__form--class').html(
		`
		<form>
		<div class="services-form__input-wrapper">
			<label for="input-fio-2" class="services-form__label">ФИО</label>
			<input type="text" id="input-fio-2" class="services-form__input" placeholder="ФИО">
		</div>
		<div class="services-form__input-wrapper">
			<label for="input-class-2" class="services-form__label">Название класса</label>
			<input type="text" id="input-class-2" class="services-form__input"
				placeholder="Название класса">
		</div>
		<div class="services-form__input-wrapper">
			<label for="input-date-2" class="services-form__label">Дата</label>
			<input type="date" id="input-date-2" class="services-form__input">
		</div>
		<div class="services-form__input-wrapper">
			<label for="input-time-2" class="services-form__label">Время</label>
			<input type="time" id="input-time-2" class="services-form__input">
		</div>
		<div class="services-form__input-wrapper services-form__input-wrapper--tel">
			<label for="input-phone-2" class="services-form__label">Номер телефона</label>
			<input type="tel" id="input-phone-2" class="services-form__input" placeholder="Номер телефона">
		</div>
		<button class="services-form__btn" type="submit">отправить заявку</button>
	</form>
			`
	);

	$()
	$('.services__list').fadeOut(300, function () {

		setTimeout(function () {
			$('.services__form').fadeIn(300);
			$('.services__form').addClass('_active');

		}, 350);
	})
	$('.services__form--class').find('form').submit(function (e) {
		console.log(item);
		let data = {
			'client_name': $('#input-fio-2').val(),
			'phone': $('#input-phone-2').val(),
			'class_name': $('#input-class-2').val(),
			'date': $('#input-date-2').val(),
			'time': $('#input-time-2').val()
		}
		console.log(data);
		sendOrder(data, 'comm_class');

		e.preventDefault();
	})
}


function getPersonals() {
	$.ajax({
		type: "GET",
		url: `${serverUrl}/personal_trainings`,
		success: function (data) {
			console.log(data);
			let personals = data;

			for (let item of personals) {
				$('.services__list--personal').find('.services-list__items').append(
					`
				<div class="services-list__item">
									<div class="services-list__item-left">
										<p class="services-list__item-title">${item['title']}</p>
										<p class="services-list__item-subtitle">${item['description']}</p>
									</div>
									<div class="services-list__item-right">
										<p class="services-list__item-price">${item['price']} р.</p>
										<button data-id="${item['id']}" class="services-list__item-btn">заказать</button>
									</div>
								</div>
				`
				);

			};

			$('.services__list--personal').find('.services-list__item-btn').click(function () {
				openFormPersonal(personals.find(x => x.id == $(this).data('id')));
			})
		},
		error: function (errMsg) {
			console.log("Error: ", errMsg)
		},
		contentType: "application/json; charset=utf-8",
		dataType: "json",
	});

}

function openFormPersonal(item) {

	$('.services__list').removeClass('_active');
	$('.services__form--personal').html(
		`
		<form>
		<div class="services-form__input-wrapper">
			<label for="input-fio-3" class="services-form__label">ФИО</label>
			<input type="text" id="input-fio-3" class="services-form__input" placeholder="ФИО">
		</div>
		<div class="services-form__input-wrapper">
			<label for="input-name-3" class="services-form__label">Имя тренера</label>
			<input type="text" id="input-name-3" class="services-form__input" placeholder="Имя тренера">
		</div>
		<div class="services-form__input-wrapper services-form__input-wrapper--tel">
			<label for="input-phone-3" class="services-form__label">Номер телефона</label>
			<input type="tel" id="input-phone-3" class="services-form__input" placeholder="Номер телефона">
		</div>
		<button class="services-form__btn" type="submit">отправить заявку</button>
	</form>
			`
	);

	$()
	$('.services__list').fadeOut(300, function () {

		setTimeout(function () {
			$('.services__form').fadeIn(300);
			$('.services__form').addClass('_active');

		}, 350);
	})
	$('.services__form--personal').find('form').submit(function (e) {
		console.log(item);
		let data = {
			'client_name': $('#input-fio-3').val(),
			'phone': $('#input-phone-3').val(),
			'trainer_name': $('#input-name-3').val()
		}
		console.log(data);
		sendOrder(data, 'personal');

		e.preventDefault();
	})
}


function getAdditionals() {

	$.ajax({
		type: "GET",
		url: `${serverUrl}/add_services`,
		success: function (data) {
			console.log(data);
			let additionals = data;

			for (let item of additionals) {
				$('.services__list--additional').find('.services-list__items').append(
					`
					<div class="services-list__item">
										<div class="services-list__item-left">
											<p class="services-list__item-title">${item['title']}</p>
											<p class="services-list__item-subtitle">${item['description']}</p>
										</div>
										<div class="services-list__item-right">
											<p class="services-list__item-price">${item['price']} р.</p>
											<button data-id="${item['id']}" class="services-list__item-btn">заказать</button>
										</div>
									</div>
					`
				);

			};

			$('.services__list--additional').find('.services-list__item-btn').click(function () {
				openFormAdditional(additionals.find(x => x.id == $(this).data('id')));
			})
		},
		error: function (errMsg) {
			console.log("Error: ", errMsg)
		},
		contentType: "application/json; charset=utf-8",
		dataType: "json",
	});


}

function openFormAdditional(item) {

	$('.services__list').removeClass('_active');
	$('.services__form--additional').html(
		`
		<form>
		<div class="services-form__input-wrapper">
			<label for="input-fio-4" class="services-form__label">ФИО</label>
			<input type="text" id="input-fio-4" class="services-form__input" placeholder="ФИО">
		</div>
		<div class="services-form__input-wrapper services-form__input-wrapper--tel">
			<label for="input-phone-4" class="services-form__label">Номер телефона</label>
			<input type="tel" id="input-phone-4" class="services-form__input" placeholder="Номер телефона">
		</div>
		<button class="services-form__btn" type="submit">отправить заявку</button>
	</form>
			`
	);

	$()
	$('.services__list').fadeOut(300, function () {

		setTimeout(function () {
			$('.services__form').fadeIn(300);
			$('.services__form').addClass('_active');

		}, 350);
	})
	$('.services__form--additional').find('form').submit(function (e) {
		console.log(item);
		let data = {
			'client_name': $('#input-fio-4').val(),
			'phone': $('#input-phone-4').val()
		}
		console.log(data);
		sendOrder(data, 'abonement');

		e.preventDefault();
	})
}


function getPromotions() {

	$.ajax({
		type: "GET",
		url: `${serverUrl}/promotions`,
		success: function (data) {
			console.log(data);
			let promotions = data;

			for (let promotion of promotions) {
				$('.promotions__items').append(
					`
					<a data-id="${promotion['id']}" class="item-promotion sales-popup-link">
								<img src="${promotion['image_full']}" alt=""> 
								<p>${promotion['image_full']}</p>
							</a>
					`
				)
			}

			$('.sales-popup-link').click(function (e) {
				let item = promotions.find(x => x.id == $(this).data('id'));
				openPromotionModal(item);
				e.preventDefault();
			})


			$('.promotions__items').slick({
				arrows: true,
				dots: true
			})
		},
		error: function (errMsg) {
			console.log("Error: ", errMsg)
		},
		contentType: "application/json; charset=utf-8",
		dataType: "json",
	});

}

function formatDate(date) {
	console.log('format date');
	let days = date.getDate();
	if (+days < 10) days = '0' + days.toString();
	let months = date.getMonth();
	if (+months < 10) months = '0' + months.toString();


	return days + '.' + months + '.' + date.getFullYear();
}

function openPromotionModal(promotion) {
	console.log('open promo');
	console.log(promotion);

	let dateStart = formatDate(new Date(promotion['date_start']));
	let dateEnd = formatDate(new Date(promotion['date_end']));


	$('#sales-popup').find('.popup__block').html(
		`
		<h2 id="sales-popup-title" class="popup__title">${promotion['title']}</h2>
		<div class="popup__body">
						<div class="popup__img">
							<img id="sales-popup-img" src="${promotion['image_mini']}" alt="">
							<div>
								<p id="sales-popup-limits" class="popup__date-info">${dateStart} - ${dateEnd}</p>
							</div>
						</div>
						<div class="popup__info">
							<p id="sales-popup-description">${promotion['description']}</p>
						</div>
					</div>
					<a href="#" class="popup__btn btn close-popup">Классная акция!</a>
		`
	);
	$('#sales-popup').addClass('open');

	$('#sales-popup').click(function (e) {
		if (!e.target.closest('.popup__content')) {
			$('#sales-popup').removeClass('open');
		}
	});

	$('#sales-popup').find('.close-popup').click(function (e) {
		console.log('sales close')
		$('#sales-popup').removeClass('open');
		e.preventDefault();
	})
}

function getNews() {
	$.ajax({
		type: "GET",
		url: `${serverUrl}/news`,
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
							<p class="item-news__title popup-news-link" data-id="${item['id']}">${item['title']}</p>

							<p class="item-news__text item-news__text--big">${item['text_full']}</p>
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
							<p class="item-news__title popup-news-link" data-id="${item['id']}">${item['title']}</p>

							<p class="item-news__text">${item['text_full']}</p>
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
					<h2 id="news-popup-title" class="popup__title">${newsItem.title}</h2>
					<div class="popup__body">
						<div class="popup__img">
							<img id="news-popup-img" src="${newsItem.image}" alt="">
						</div>
						<div class="popup__info">
							<p id="news-popup-description">${newsItem.text_full}</p>
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

function sendOrder(item, type) {
	let dataToSend;
	switch (type) {
		case 'abonement':
			dataToSend = {
				'type': type,
				'phone': item['phone'],
				'client_name': item['client_name']
			}
			break;

		case 'comm_class':
			dataToSend = {
				'type': type,
				'phone': item['phone'],
				'client_name': item['client_name'],
				'class_name': item['class_name'],
				'order_date': item['date'],
				'order_time': item['time']
			}
			break;

		case 'personal':
			dataToSend = {
				'type': type,
				'phone': item['phone'],
				'client_name': item['client_name'],
				'trainer_name': item['trainer_name']
			}
			break;

		default:
			console.log('err type');
			break;
	}

	if (dataToSend) {
		$.ajax({
			type: "POST",
			url: `${serverUrl}/order`,
			data: dataToSend,
			success: function (msg) {
				console.log(msg);
				$('#order-popup').addClass('open');

				setTimeout(function () {
					$(location).attr('href', '');
				}, 2000);
			},
			error: function (errMsg) {
				console.log("Error: ", errMsg)
			}
		});
	}



}