var forms = require("forms");
var fields = forms.fields;
var validators = forms.validators;

/*
 * Define the registration form fields here
 */
var reg_form = forms.create({
	name: fields.string({required: true}),
	role: fields.string({required: true}),
	email: fields.email({required: true}),
	password: fields.password({required: true}),
	confirm: fields.password({
		required: true,
		validators: [validators.matchField('password')]
	})
});

exports.index = function( req, res )
{
	res.render('register', {
		title: 'Registration',
		form: reg_form.toHTML()
	});
}

exports.process = function( req, res )
{
	reg_form.handle(req, {
		success: function( form ) 
		{
			var UserProvider = require("../models/user").UserProvider;
			var userProvider = new UserProvider();
			//send the form data to the user model to create the user
			userProvider.createNewUser(form.data, function(err, result) {
				if(err)
				{
					if(err.email) {
						form.fields.email.error = 
							'Someone has registered this email, did you forget your password?'
					}

					//There was an error, so re-render the form with the updated messages
					res.render('register', {
						title: 'Registration',
						error: true,
						form: form.toHTML()
					});
				}
				else 
				{
					//Yay, render completion
					res.render('register-complete', {
						title: 'Registration Finished!'
					});
				}
			});
		},
		other: function( form )
		{
			//An error happened, render the form
			res.render('register', {
				title: 'Registration',
				error: true,
				form: form.toHTML()
			});
		}
	});
}