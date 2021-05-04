	$('.header__burger').click(function(event){
		$('.header__burger,.header__menu').toggleClass('_active')
		$('body').toggleClass('_lock')
	});