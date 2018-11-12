"use strict"

var doc = document;
var thumbsList = doc.querySelector('.slider_thumbs');
var thumb = doc.querySelector('.slider_thumb');
var bigImage = doc.getElementById('big_image');
var arrowPrev = doc.getElementById('slide_prev');
var arrowNext = doc.getElementById('slide_next');
var slideshow = doc.getElementById('slideshow');
var thumbnails = doc.getElementById('thumbnails');
var seconds = slideshow.dataset.seconds * 1000;
var activeThumb, prevImg, nextImg, interval;

for (let i = 1; i <= 6; i++) {
	thumbsList.insertAdjacentHTML('beforeend', '<li><img class="slider_thumb" src="img/'+ i +'.jpg" /></li>');
	if ( i == 1 ) {
		thumbsList.firstChild.classList.add('active');
	}
};

// Кликаем по миниатюре, берём её src и вставляем фоном на главный экран.
var changeImage = function(evt) {
	if (evt.target.classList.contains('slider_thumb') == true) {
		let path = evt.target.src;
		bigImage.style.backgroundImage = 'url('+ path +')';
		bigImage.classList.remove('animate'); // удаляем анимацию ken burst
		setTimeout(function() {
			bigImage.classList.add('animate'); // добавляем анимацию ken burst к ново-появившемуся слайду
		}, 50);

		// Ищем активные миниатюры через цикл по всему массиву и удаляем его
		let currentActive = doc.querySelectorAll('.active');
		for (let i = 0; i < currentActive.length; i++) {
			currentActive[i].classList.remove('active');
		}
		evt.target.parentNode.classList.add('active'); // добавляем активный класс к активной миниатюре
		clearInterval(interval); // Сбросим интервал слайдшоу и запустим его заново
		initSlideshow();
	}
};

// Ищем активный тумб (миниатюру), в зависимости от того, первый оно или последний берём по сторонам от него картинки, которые присваиваем в переменные для дальнейшей обработки
var checkActiveThumb = function() {
	activeThumb = thumbsList.querySelectorAll('li.active')[0];
	if ( thumbsList.querySelectorAll('li.active:first-child').length ) {
		prevImg = thumbsList.lastChild.children[0].src;
		nextImg = activeThumb.nextSibling.children[0].src;
	} else if ( thumbsList.querySelectorAll('li.active:last-child').length ) {
		prevImg = activeThumb.previousSibling.children[0].src;
		nextImg = thumbsList.firstChild.children[0].src;
	} else {
		prevImg = activeThumb.previousSibling.children[0].src;
		nextImg = activeThumb.nextSibling.children[0].src;
	}
};

// Полученные картинки в переменных из функции checkActiveThumb присваиваем стрелкам навигации. Здесь работает только при клике на миниатюру.
var updateArrowImages = function(evt) {
	if (evt.target.classList.contains('slider_thumb') == true) {
		checkActiveThumb();
		arrowPrev.style.backgroundImage = 'url('+ prevImg +')';
		arrowNext.style.backgroundImage = 'url('+ nextImg +')';
	}
};

// То же самое, что и выше, но эта функции инициализируется при загрузке страницы. Хотелось бы объеденить как-то это повторение, но не знаю как.
var initArrowsImages = function() {
	checkActiveThumb();
	arrowPrev.style.backgroundImage = 'url('+ prevImg +')';
	arrowNext.style.backgroundImage = 'url('+ nextImg +')';
};
initArrowsImages(); // при загрузке страницы вставляем картинки в стрелки навигации

doc.addEventListener('click', changeImage);
doc.addEventListener('click', updateArrowImages);

// Меняем картинку при клике на стрелку "влево".
doc.querySelector('.arrow_previous').onclick = function() {
	checkActiveThumb();
	if ( thumbsList.querySelectorAll('li.active:first-child').length ) {
		thumbsList.lastChild.children[0].click();
	} else {
		activeThumb.previousSibling.children[0].click();
	}
	arrowPrev.style.backgroundImage = 'url('+ prevImg +')';
	arrowNext.style.backgroundImage = 'url('+ nextImg +')';
	clearInterval(interval); // Сбросим интервал слайдшоу и запустим его заново
	initSlideshow();
};

// Меняем картинку при клике на стрелку "вправо".
doc.querySelector('.arrow_next').onclick = function() {
	checkActiveThumb();
	if ( thumbsList.querySelectorAll('li.active:last-child').length ) {
		thumbsList.firstChild.children[0].click();
	} else {
		activeThumb.nextSibling.children[0].click();
	}
	arrowPrev.style.backgroundImage = 'url('+ prevImg +')';
	arrowNext.style.backgroundImage = 'url('+ nextImg +')';
	clearInterval(interval);
	initSlideshow();
};

// Слайдшоу. Если чекбокс (вверху справа "Слайдошоу") отмечен / не отмечен, соотв. запускам или убиваем интервал смены слайдов (то бишь клик по стрелке "вправо", которая запустит всё что надо сама).
var initSlideshow = function() {
	if ( slideshow.checked == true ) {
		interval = setInterval(function(){
			doc.querySelector('.arrow_next').click();
		}, seconds);
	} else {
		clearInterval(interval);
	}
};

initSlideshow(); // запускаем проверку состояния чекбокса при загрузке страницы
slideshow.onchange = function() { // при смены состояния чекбокса вызываем проверку, стартовать слайдшоу или нет. При этом слайдшоу не запускается при клике на стрелки навигации, т.к. там прописан его "старт".
	initSlideshow();
};

// Инициализируем показ/скрытие панели с миниатюрами
var initThumbnails = function() {
	if ( thumbnails.checked == true ) {
		thumbsList.classList.add('visible');
	} else {
		thumbsList.classList.remove('visible');
	}
};

// По состоянию чекбокса показываем/скрываем панель с миниатюрами
thumbnails.onchange = function() {
	initThumbnails();
};