// Проверка, загрузилась ли страница
$(document).ready(function () {

	$('.third__slider').slick({
		slidesToShow: 1,
		dots: true,
		centerMode: true,
		centerPadding: '30%',
		arrows: true,
		appendDots: '.dots-wrapper'
	});

});