if(!window.App) window.App = {};

window.App.Signin = (function(){ return {
    signout: function signout(){
        $.ajax({
            type: 'GET',
            url: 'https://accounts.google.com/o/oauth2/revoke',
            data: { token: App.authentication['access_token'] },
            async: false,
            dataType: 'jsonp',
            success: function(rsp){
                console.log("Succesfully signed out");
            },
            error: function(e){ console.log(e); }
        });
    },
    onSignin : function onSignin(auth){
        gapi.client.load('plus','v1', function(){
            if(auth['access_token']){
                window.App.authentication = auth;
                $('#loginModal').modal('hide');
                $('#logout').on('click', App.Signin.signout);

                var request = gapi.client.plus.people.get( {'userId' : 'me'} );
                request.execute( function(profile) {
                    window.App.profile = profile;
                    window.App.Initialize();
                });
            }else if(auth['error']){
                // show modal
                $('#loginModal').modal({ show: true, keyboard: false });
                console.log("Error during signin", auth);
            }
        });
    },
    renderSignin : function renderSignin(){
        gapi.signin.render('signinBtn', {
            callback: App.Signin.onSignin,
            clientid: "166612591389.apps.googleusercontent.com",
            cookiepolicy: "single_host_origin",
            requestvisibleactions: "http://schemas.google.com/AddActivity",
            scope: "https://www.googleapis.com/auth/plus.login"
        });
    }
}}());


(function() {
    var po = document.createElement('script'); po.type = 'text/javascript';
    po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js?onload=renderSignin';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
})();

function renderSignin(){
    App.Signin.renderSignin();
}
