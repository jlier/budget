const budget_router = require('express').Router();

const user_controller = require('../user/user.js');
const budget_controller = require('./budget.js');

budget_router.get('/', user_controller.checkLogin, budget_controller.budget);
budget_router.post('/update', user_controller.checkLogin, budget_controller.update);

module.exports = budget_router;