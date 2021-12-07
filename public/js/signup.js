$(document).ready( () => {
	$('#sInputPassword, #sInputCPassword').on('keyup', () => {
		if ($('#sInputPassword').val() == $('#sInputCPassword').val()) {
			$('#message').html("Matching").addClass('text-success').removeClass('text-danger')
			$('#btnSubmit').attr('disabled', false)
		} else {
			$('#message').html("Not Matching").addClass('text-danger').removeClass('text-success')
			$('#btnSubmit').attr('disabled', true)
		}
	})
})