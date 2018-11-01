"use strict"

var currency = ' руб.';
var nds = '10%';
var cartTableSum = document.querySelector('#tableSum');
var products = [
	{
		image: 'prod.jpg',
		name: 'Finest / Working Dog Fish Complete',
		price: 750,
		added: 3,
		link: 'cart.html'
	},
	{
		image: 'prod2.jpg',
		name: 'Yorkshire Terrier Junior',
		price: 200,
		added: 1,
		link: 'cart.html'
	},
	{
		image: 'prod.jpg',
		name: ' Golden Retriever Junior',
		price: 550,
		added: 5,
		link: 'cart.html'
	}
];

var deliveryPrice = 0;
var delivery = [
	{
		id: 'delivery-post',
		name: 'Почта России',
		price: 59
	},
	{
		id: 'delivery-curier',
		name: 'Доставка курьером',
		price: 300
	},
	{
		id: 'delivery-self',
		name: 'Самовывоз из магазина (с 8 до 15)',
		price: 0
	}
];

/* ТОВАРЫ В ТАБЛИЦЕ */

// Проходим циклом по объекту и добавляем каждый товар в конец таблицы с товарами.
var tableSum = 0;
for (let i = 0; i < products.length; i++) {
	let productTotal = products[i].price * products[i].added; // цена товара умноженная на кол-во добавленных единиц
	tableSum += productTotal; // сумма всех итоговых цен без НДС

	document.querySelector('.cart_table').insertAdjacentHTML('beforeend', '<tr>\
													<td><img src="img/' + products[i].image + '" /></td>\
													<td><a href="' + products[i].link + '">' + products[i].name + '</a></td>\
													<td>' + products[i].price + currency + '</td>\
													<td align="center">' + products[i].added + '</td>\
													<td class="fw500">' + productTotal + currency + '</td>\
													<td><a class="cart_product_remove" href="#"></a></td>\
												</tr>');
};
var tableSumCache = tableSum; // закешим итог без НДС безызменно для обработки купонами

function updateTableTotal() {
	cartTableSum.innerText = tableSum + currency; // выводим итоговую цену за продукты без НДС
};
updateTableTotal();



/* КУПОНЫ */

// Проверяем введённое значение в поле Купона. Если оно совпадает с одним из вариантов ниже, возвращаем discount значение скидки.
var discount = function() {
	let result = document.querySelector('.discount_input').value;
	switch (result) {
		case 'DISCO':
			result = 30;
			alert('Промокод активирован, вы получили скидку ' + result + '%');
			return result;
			break;
		case 'INFERNO':
			result = 80;
			alert('Промокод активирован, вы получили скидку ' + result + '%');
			return result;
			break;
		default:
			alert('Промокода не существует. [Введите "DISCO" или "INFERNO"]');
			return false;
			break;
	}
};

document.querySelector('#discount_activate').onclick = function(e) {
	e.preventDefault();
	let discountVal = discount(); // чтобы функция не воспроизводилась несколько раз подряд, запишем значение один раз в переменную
	if ( discountVal != false ) { // если введённое значение в поле купона НЕ ноль или false, то выполним условие
		tableSum = tableSumCache - (tableSumCache / 100 * discountVal); 
		updateTableTotal(); // впишем полученный результат со скидкой в тег.
		updateTotal(); // итог со скидкой + цена доставки и выводим сумму в #total
	}
	else if ( discountVal == false ) { // если не совпадает с купонными словами, выведем начальную итоговую цену
		tableSum = tableSumCache;
		updateTableTotal();
		updateTotal();
	}
};



/* ДОСТАВКА */

for (let i = 0; i < delivery.length; i++) {
	document.querySelector('.delivery_flex')
	.insertAdjacentHTML('beforeend', '<div class="delivery_ib">\
											<input class="delivery_radio" type="radio" id="' + delivery[i].id + '" value="' + delivery[i].price + '" name="delivery" />\
											<label for="' + delivery[i].id + '">\
												<span>Выбрать</span>\
												<strong>' + delivery[i].price + currency + '</strong>\
												<div>' + delivery[i].name + '</div>\
											</label>\
										</div>');
};

// вытаскиваем цену доставки при клике на соотв. выбор и вызываем функция подсчёта итога с НДС
document.onclick = function(event) {
	if (event.target.classList.contains('delivery_radio') == true) {
		deliveryPrice = event.target.value;
		updateTotal();
	}
};

function updateTotal() {
	let total = parseInt(tableSum) + parseInt(deliveryPrice); // достаём итоговую сумму товаров + доставки без НДС и ....
	document.querySelector('#noNDS').innerText = total + currency; // выводим её маленьким шрифтом под большим

	total = total + (total / 100 * parseInt(nds)); // а тут уже посчитаем с НДС ....
	document.querySelector('#total').innerText = total + currency; // и выведем итог с НДС большим шрифтом в конце страницы
};
updateTotal();



/* УДАЛИТЬ ТОВАР ИЗ КОРЗИНЫ */

document.onclick = function(event) {
	if (event.target.classList.contains('cart_product_remove') == true) {
		alert('Упс... Не осилил всё за один раз :)');
	}
}