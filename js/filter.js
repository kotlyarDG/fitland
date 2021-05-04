// Скрипт для фильтрации по кнопке с классом filter__btn
$('.filter__btn').click(function(event) {
		var cat = $(this).data('filter');
	event.preventDefault();

// Присвоение ссылке класса active-filter
	$('.filter__btn.active-filter').removeClass('active-filter')
	$(this).addClass('active-filter')

// При категории 1 - показывает все элементы с классом filter__item
// В ином случае показывает элементы с классом f_ + номер категории
	if(cat == 1){
		$('.filter__item').show();
	} else {
		$('.filter__item').hide();
		$('.filter__item.f_' + cat).show();
	}

});