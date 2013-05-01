var forms = require("forms");
var fields = forms.fields;
var validators = forms.validators;
var LoginProvider = require("../models/login").LoginProvider;
/*
 * Define the registration form fields here
 */
var login_form = forms.create({
	email: fields.email({required: true}),
	password: fields.password({required: true})
});

exports.index = function(req, res) {
	res.render('login', {
		title: 'Login',
		form: login_form.toHTML()
	});
};

exports.logout = function(req, res) {
	var loginProvider = new LoginProvider();
	loginProvider.logout(req, function() {
		res.redirect("/login");
	});
}

exports.process = function(req, res) {
	login_form.handle(req, {
		success: function( form ) 
		{
			var loginProvider = new LoginProvider();
			loginProvider.login(form.data.email, form.data.password, req, function(result) {
				if(result === true) {
					res.redirect('/user/home');
				} else {
					form.fields.email.error = 
							"Oops, we can't find this email in our system.";
					//Login is bad, render the form
					res.render('login', {
						title: 'Login',
						failed: true,
						form: form.toHTML()
					});
				}
			});
		},
		other: function( form )
		{
			//An error happened, render the form
			res.render('login', {
				title: 'Login',
				error: true,
				form: form.toHTML()
			});
		}
	});
};