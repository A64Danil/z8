/**
 * Created by Danil on 27.02.2018.
 */
console.log("NODE JS are working. Тест русских символов");


var cityList = document.body.querySelector('.cityList');
var content = document.body.querySelector('.content');

var newCityList = []; // City List
var findCity = []; // Resulf of maching

var textField =  document.createElement('input'); // City Input

var textFieldHintsWrap =  document.createElement('div'); // Place for Hints

var resCountWrap = document.createElement('div'); // Count results of search



function loadTowns(url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities2.json') {
    console.log('пытаемся загрузить города, ' + url)
    return new Promise ((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();
        xhr.addEventListener('load', () => {

            if (xhr.status !== 200) {
                console.log('всё пошло по пизде');
                reject(xhr.status);
            }

            var result = JSON.parse(xhr.response);
            result.sort(function(a, b) {

                var c = a.name,
                    d = b.name;

                if( c < d ){
                    return -1;
                }else if( c > d ){
                    return 1;
                }

                return 0;
            });

            console.log('после сортировки');
            console.log(result);
            resolve(result);
        });

    });
}


function createTextField() {

    var textFieldLabel=  document.createElement('label');
    textFieldLabel.textContent = "Поиск по списку городов";
    cityList.insertBefore(textFieldLabel, content);

    var textFieldWrap =  document.createElement('div'); // City Input Wrapper
    textFieldWrap.setAttribute('class', 'input-group');
    cityList.insertBefore(textFieldWrap, content);

    textField.setAttribute('type', 'text');
    textField.setAttribute('class', 'form-control city-input');
    textField.setAttribute('placeholder', 'Введите название города');
    textFieldWrap.appendChild(textField);

    textFieldHintsWrap.setAttribute('class', 'hintsWrap');
    resCountWrap.setAttribute('class', 'count-results');
    textFieldWrap.appendChild(resCountWrap);
    textFieldWrap.appendChild(textFieldHintsWrap);


    textFieldHintsWrap.addEventListener('click', function (e) {
        //console.log(e.target.textContent);
        textField.value = e.target.textContent;
        resCountWrap.textContent = null;
    })

}


function cityListCreate(value) {
    console.log('Список формируется');
    for (let i = 0; i < value.length; i++) {
        let newCity = document.createElement('li');
        newCityList[i] = value[i].name;
        newCity.textContent = newCityList[i];
        content.appendChild(newCity);
    }
    console.log('Список готов');
}

function  tryAgain() {
    console.log('Запустили трай эгэйн')
    var againBut =  document.createElement('button');
    againBut.textContent = 'Попробовать загрузить снова';

    content.innerHTML = '<p class="error_msg">Не удалось загрузить список</p>'
    content.appendChild(againBut);

    againBut.addEventListener('click', function () {
        console.log('click');
        let url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';
        loadTowns(url).then(
            (value) => {
            console.log('Повторная загрузка успешно завершена');
            cityListCreate(value);
            var message = content.querySelector('.error_msg');
            content.removeChild(message);
            content.removeChild(againBut);
            console.log('Лишние элементы удалены');
            },
            (value) => {
            console.log('Повторная загрузка, код ошибки: ' + value);
            }
        );
    })

}

document.body.addEventListener('click', function () {
    textField.setAttribute('class', 'form-control city-input closed');
    resCountWrap.textContent = null;
})

function findPartial( arr, ell ) {
    var regex = new RegExp(ell, 'i');
    var resCount = 0;

    while (textFieldHintsWrap.firstChild) {
        console.log("Чистим контейнер от старых")
        textFieldHintsWrap.removeChild(textFieldHintsWrap.firstChild);
    }

    for (let i = 0; i < arr.length; i++) { // Заполняем подсказками
        if (arr[i].match(regex) ) {
            let curHint = document.createElement('div');

            curHint.setAttribute('class', 'hint');
            curHint.textContent = arr[i];
            textFieldHintsWrap.appendChild(curHint);

            resCount++;
            console.log("Точное совпадение, " + arr[i])
        }
    }
    resCountWrap.textContent = "(найдено: " + resCount + " )";
}


textField.addEventListener('keyup', function() {
    textField.setAttribute('class', 'form-control city-input');
    console.log("отпустили клавишу");
    findPartial( newCityList, textField.value);
    //console.log(textField.value);
    //console.log(newCityList);
});


function pageLoader() {
    return new Promise ((resolve) => {
        var loadWrap =  document.body.querySelector('.loader-wrap');
        window.addEventListener('load', function () {
           document.body.removeChild(loadWrap);
           loadText = null;
           loadWrap = null;
           resolve();
       });
    });
}

pageLoader()
    .then(
        function () {

        }
    )
    .then(function () {
        console.log('Перед создание поля');
        setTimeout( () => {
            createTextField();
        }, 1000);
        //alert('После появление текстового поля');
    });

loadTowns()
    .then(
        (value) => {
            cityListCreate(value);
        },
        (value) => {
            tryAgain();
            console.log('Что-то пошло не так, код ошибки: ' + value);
        }
    )

