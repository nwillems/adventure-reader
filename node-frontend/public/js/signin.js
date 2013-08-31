if(!window.App) window.App = {};

function signout(){
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
}

(function() {
    var po = document.createElement('script'); po.type = 'text/javascript';
    po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js?onload=renderSignin';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
})();

function signinCallback(auth){
    if(auth['error']){
        // show modal
        $('#loginModal').modal({ show: true, keyboard: false });
    }else{
        window.App.authentication = auth;
        $('#loginModal').modal('hide');
        $('#logout').on('click', signout);

        window.App.Initialize();
    }
}

function renderSignin(){
    gapi.signin.render('signinBtn', {
        callback: "signinCallback",
        clientid: "166612591389.apps.googleusercontent.com",
        cookiepolicy: "single_host_origin",
        requestvisibleactions: "http://schemas.google.com/AddActivity",
        scope: "https://www.googleapis.com/auth/plus.login"
    });
}
