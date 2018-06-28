var buttPassw = document.getElementById('buttPasswEnter');
var inp = document.getElementById('inp');
var uncorrect = document.getElementById('spanUncorectPas');
buttPassw.addEventListener('click', function () {
    if (inp.value.toLowerCase() == "arcoirisua" || inp.value.toLowerCase() == "arcoiris.ua" || inp.value.toLowerCase() == "arco iris ua" || inp.value.toLowerCase() == "arco iris.ua" || inp.value.toLowerCase() == "arcoirisua ") {
        location.href = 'public/routes/enter.html';
    }else if(inp.value.toLowerCase() == "1234"){
        location.href = '/admin';
    }else{
        uncorrect.style.display = 'block';
    }

});
$('#showpass').click(function(){
    var type = $('input').attr('type') == "text" ? "password" : 'text';
    $('input').prop('type', type);
});