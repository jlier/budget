$(document).ready( () => {
	var left = parseInt($("#left").val(), 10);
	var monthly = parseInt($("#monthly").val(), 10);
	
	var date = new Date();
	var today = date.getDate();

	var left_add = 0;
	var month_add = 0;

	if(today >= 25 || today < 12) 
		left_add += monthly / 2;
		if (today >= 25) {
			month_add = 1;
	}
	
	var prev_salary = new Date(date.getYear() + 1900, date.getMonth() + month_add - 1, 25); 
	var salary = new Date(date.getYear() + 1900, date.getMonth() + month_add, 25); 
	
	var num_days = Math.ceil((salary - prev_salary) / 1000 / 3600 / 24)
	var current_date_diff = Math.ceil((date - prev_salary) / 1000 / 3600 / 24)
	
	var res = (monthly / num_days * current_date_diff - monthly + left + left_add).toFixed(2);
	var altRes = ((left + left_add) / (num_days - current_date_diff + 1)).toFixed(2);

	var stat = $("#statusText");
	var altStat = $("#altStatusText");

	var prefix = "";

	if(res < 0) {
		stat.addClass('text-danger');

		var days_until_positive = Math.ceil((res * -1) / (monthly / num_days))
		$("#days").text(`${ days_until_positive } ${ days_until_positive === 1 ? 'dag' : 'dager'} bak skjema..`);
	}
	else {
		prefix = "+"
	}

	stat.text(`${ prefix }${ res } kr`);
	altStat.text(`${ altRes } kr/dag`);

	$("#refresh").click(() => {
		location.reload(true);
	});

	$("#logout").click(() => {
		location.redirect('/logout');
	});
});