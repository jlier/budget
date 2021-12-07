const router = require('express').Router()

const controller = require('./controller.js')

router.get('/', 		controller.budget)
router.post('/update', 	controller.update)

module.exports = router