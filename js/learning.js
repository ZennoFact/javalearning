// UIパーツのサイズ設定
var h = window.innerHeight - $('header').height()- 40;
$('.box').height(h);
var btnHight = $('.button-box').height();
$('.editor').height(h - btnHight - 10);

// イベントの処理
$('a').click(function(){
    var index = this.getAttribute("data-index");
    load("description", index);
    load("code", index);
    var newIndex = parseInt(index) + 1;
    $('#nextBtn').attr({"data-index": newIndex});
});

$('#nextBtn').click(function() {
    var index = this.getAttribute("data-index");
    load('description', index);
    load('code', index);
    var newIndex = parseInt(index) + 1;
    $('#nextBtn').attr({"data-index": newIndex});
    $(this).prop('disabled', true);
    $(this).removeClass('ok');
});


// 授業コンテンツの読み込み
var load = function(target, fileNumber) {
    var file = data[fileNumber][target];
    file = convertToCode(file);
    // コードの場合のみ，色を付ける
    if (target === 'code') file = textDecoration(file);
    document.getElementById(target).innerHTML = file;

    if (target === 'code') {
        $('.input').each(function (i, elem) {
            $(this).attr({"data-index": fileNumber + '-' + i})
                .blur(function () {
                    dataSave(fileNumber + '-' + i, $(this).val());
                });

            dataLoad();

            // 個別の正解に合わせた回答欄の幅の調整
            var length = data[fileNumber].answer[i].length;
            $(this).css({"width": (length / 2 + 1)  + "em"});

            if ($(this).val() === data[fileNumber].answer[i]) {
                this.classList.add('ok');
            }
            elem.addEventListener("keyup", function () {
                inputStringCheck(this, fileNumber);
            });
        });
    }

    $("#nextBtn").prop("disabled", true);
    checkGoToNext();
};

 var inputStringCheck = function(self, index) {
    jQuery.each($(".input"), function(i, elem) {
        if (self === elem) {
            var text = self.innerHTML;
            if ($(':focus').length != 0) text = $(':focus').val()
            self.classList.remove('ok');
            if (text === data[index].answer[i]) {
                self.classList.add('ok');
            }
            checkGoToNext();
        }
    });
};

var checkGoToNext = function() {
    var flag = true;
    $(".input").each(function(i, elem){
        if (!$(this).hasClass("ok")) flag = false;
    });
    if (flag) {
        $("#nextBtn").prop("disabled", false);
        $("#nextBtn").addClass("ok");
    } else {
        $("#nextBtn").prop("disabled", true);
        $("#nextBtn").removeClass("ok");
    }
};

var convertToCode = function(str) {
    return str.replace(/<%b>/g, '<textarea class="input" rows="1"></textarea>');
};

var textDecoration = function(str) {
    str = str.replace(/\\t/g, '<span class="blank">&nbsp;&nbsp;&nbsp;&nbsp;</span>');
    str = str.replace(/([>\s\(\[<])(byte|short|int|long|float|double|boolean|char)([\.\s\)])/g, '$1<span class="class">$2</span>$3');
    str = str.replace(/([>\s\(\[<])([A-Z][A-Za-z0-9]+?)([\.\s\)\[])/g, '$1<span class="class">$2</span>$3');
    str = str.replace(/\.([A-Za-z0-9]+?)\(/g, '.<span class="method">$1</span>(');
    str = str.replace(/(<br>|\s|\()(".*?")(\s|\)|\.|;)/g, '$1<span class="string">$2</span>$3');
    str = str.replace(/(\s|>|\))(;|new)(\s|\.|$|<br>)/g, '$1<span class="reserved">$2</span>$3');
    str = str.replace(/(\s|[A-Za-z0-9]|>)(=|\+|\-|\*|\/|%|\.)(\s|[A-Za-z0-9]|<)/g, '$1<span class="reserved">$2</span>$3');
    str = str.replace(/(^|[\s>]*?)(public|private|protected|static|void|class|interface|extends|implements)(\s)/g, '$1<span class="reserved">$2</span>$3');
    str = str.replace(/(^|>|\s)(\/\/.*?)(<br>|$)/g, '$1<span class="comment">$2</span>$3');

    return str;
};

// データの永続化に関する処理
var dataSave = function(key, value) {
    if (window.localStorage) {
        localStorage.setItem(key, value);
    } else {
        alert('ご使用されているブラウザはローカルストレージに対応していないため，データの保存はできません。')
    }
};
var dataLoad = function() {
    $('.input').each(function () {
        var value = localStorage.getItem($(this).attr('data-index'));
        if (value !== null) $(this).val(value);
    });
};