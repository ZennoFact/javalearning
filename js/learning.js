$("a").click(function(){
    load("description", this.getAttribute("data-index"));
});

$(".input").blur(function(){
    jQuery.each($(".input"), function(i, val) {
        //$("#" + i).append(document.createTextNode(" - " + val));
        this.classList.remove('ok');
        if (this === val && this.innerText === data[0].answer[i]) {
            this.classList.add('ok');
        }
    });
});

var load = function(target, fileNumber) {
    var file = data[fileNumber][target];
    document.getElementById(target).innerHTML = convertToCode(file);
};

var convertToCode = function(str) {
    return str.replace(/<s>/g, '<span><span class="input">').replace(/<e>/g, '</span></span>');
};


// ここから頑張ってダブルクリックしたらtextFieldを表示できるようにする
var inputs = Array.prototype.slice.call(document.getElementsByClassName('input'));
inputs.forEach(function(elem) {
    elem.addEventListener('dblclick', showTextField, false);
});

function showTextField(e) {
    console.log("click");
    var item = e.target;
    item.classList.add('none');
    var input = document.createElement('input');
    input.setAttribute("type", "text");
    var regex = /Step\.\d/;
    if (regex.test(item.innerHTML)) {
        input.value = "";
    } else {
        input.value = item.innerHTML;
    }
    var parent = item.parentNode;
    input.addEventListener("keydown", function(e) {
        if (e.keyCode === 13 && input.value !== "") {
            // TODO: バリデーションチェックする
            // var classes = item.getAttribute("class").split();
            // console.log(classes);
            // if (classes[0] === "setting" && !isNumber(input.value)) {
            //   return;
            // }
            parent.firstChild.innerHTML = input.value;
            parent.firstChild.classList.remove("none")
            parent.removeChild(e.target);
            inputs.forEach(function(elem) {
                // elem.addEventListener('mouseover', showTextField, false);
                elem.addEventListener('dblclick', showTextField, false);
            });
            inputStringCheck();
        }
    });
    parent.appendChild(input);
    input.focus();
    inputs.filter(function(elem) {
        return elem !== item;
    }).forEach(function(elem) {
        elem.removeEventListener('dblclick', showTextField, false);
    });
}