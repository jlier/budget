exports.checklogin = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.redirectTo = req.originalUrl
		res.redirect('/login')
	}
	else {
		next()
	}
}

exports.redirectsecure = (req, res, next) => {
	if (req.secure) {
		next()
	} else {
		res.redirect('https://' + req.headers.host + req.url)
	}
}