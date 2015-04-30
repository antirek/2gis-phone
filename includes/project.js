var Phone = null;

var showPhone = function (hash, id, li_id) {
    console.log(hash, id);

    var url = 'profile.json';
    
    /*
    var url = 'http://catalog.api.2gis.ru/profile?hash=' + 
            hash + '&id=' + id + '&version=1.3&key=rusjdw2920';
    */

    $.getJSON(url, function (data) {
        console.log(data);

        var phone = '';
        var items = [];
        $.each( data.contacts, function (key, cont) {    
            $.each(cont, function (key, value){
                console.log(key, value);
                $.each(value, function(key, contact){
                    console.log(contact);
                    if (contact.type === 'phone'){
                        phone = contact.value;
                    }
                });
            });
        });

        console.log('phone', phone);

        if (phone !== '') {
            phone = phone.replace('+7', '8');
            var ii = "#" + li_id;
            console.log(ii);

            var link_call = "<a onclick='javascript:callPhone(\"" + phone + "\");'>" + phone + "</a>";
            $("#" + li_id).append(' ' + link_call);
        }

    });
};

var callPhone = function (phone) {
    Phone.call(phone);
};


$().ready(function(){

    $("#call").on('click', function(e){
        Phone.call($("#number").val());
    });

    $("#end").on('click', function(e){
        Phone.end();
    });

    $("#saveSettings").on('click', function(){
        console.log('save!');
        $.jStorage.set('host', $('#host').val());
        $.jStorage.set('user', $('#user').val());
        $.jStorage.set('password', $('#password').val());

        $('#myModal').modal('hide');
        initPhone();      
    });

    var startSearch = function () {
        var search = $("#search").val();
        $("#results").html("");
        //console.log(search)

        /*
        var url = 'http://catalog.api.2gis.ru/search?what=' + 
            search + '&where=Красноярск&version=1.3&key=rusjdw2920';
        */

        var url = 'data.json';
    
        $.getJSON(url, function (data) {
            console.log(data);
            var items = [];

            $.each( data.result, function( key, val ) {
                items.push( "<li id='res" + key + "'>" 
                    + val.name + ' '
                    + "<a onclick='javascript:showPhone(\""+ val.hash + "\",\"" + val.id +"\",\"res" + key + "\")'>"
                    + 'показать телефон'
                    + '</a>'
                    + "</li>");
            });
             
            $( "<ul/>", {
                "class": "my-new-list",
                html: items.join("")
            }).appendTo( "#results" );            
        });

    };
    
    $("#searchSubmit").on('click', startSearch);
    

    function initFromStorage(){
        $("#host").val($.jStorage.get('host'));
        $("#user").val($.jStorage.get('user'));
        $("#password").val($.jStorage.get('password'));

        return {
            host: $.jStorage.get('host'),
            user: $.jStorage.get('user'),
            password: $.jStorage.get('password')
        };        
    }

    function initPhone(){
        var creds = initFromStorage();

        var host = creds.host || 'localhost';
        var user = creds.user || '1060';
        var password = creds.password || 'password';

        console.log(host, user, password);

        var config = {
            uri: user + '@' + host,
            wsServers: 'ws://'+ host +':5066',
            authorizationUser: user,
            password: password,
            hackIpInContact: true,
            register: false,
            log: {
                builtinEnabled: false,
            },
            stunServers: [                                
                "stun.stunprotocol.org:3478",
                "stun.voiparound.com",
                "stun.voipbuster.com",            
                "stun.turnservers.com:3478"
            ],
        };

        Phone = new phone();
        Phone.init(host, config);
    }
    
    initPhone();

});