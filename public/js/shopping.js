$(document).ready(() => {
	var pluss_btn = $('#pluss');
	var minus_btn = $('#minus');

	pluss_btn.on('click', () => {
		alert('Pluss');
	})

	minus_btn.on('click', () => {
		alert('Minus');
	})
});