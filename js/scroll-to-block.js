// Функция для скролла по ссылке-якорю
// вместо class-link - реальный класс ссылки-якоря
// вместо slow - необходимую скорость
$(document).on('click', '.class-link', function() {
	 var linkID = $(this).attr('href');
	 $('html, body').animate({ 
    scrollTop: $(linkID).offset().top 
  }, 'slow');
});