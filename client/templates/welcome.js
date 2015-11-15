Template.welcome.events({
    'click #welcome-login-button' : function(){
        if($('#back-to-login-link'))
            $('#back-to-login-link').click();
        else
            $('#login-sign-in-link').click();
    },
    'click #welcome-create-button' : function(){
        $('#login-sign-in-link').click();
        Meteor.setTimeout(function(){
            $('#signup-link').click();
        }, 5);
    }
});