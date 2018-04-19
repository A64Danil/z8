/**
 * Created by Danil on 19.04.2018.
 */
console.log("NODE JS are working. Тест русских символов");

var cityList = document.body.querySelector('.cityList');
var content = document.body.querySelector('.content');

var newCityList = []; // City List with hints
var findCity = []; // Resulf of maching

const textField =  document.createElement('input'); // City Input

var textFieldHintsWrap =  document.createElement('div'); // Place for Hints

var resCountWrap = document.createElement('div'); // Count results of search

const cityTpl = document.querySelector('#city-tpl').textContent;
var cityRender = Handlebars.compile(cityTpl);

function loadTowns(url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json') {
    console.log('1) пытаемся загрузить города, ' + url)
    return new Promise ((resolve, reject) => {
            const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
    xhr.addEventListener('load', () => {

        if (xhr.status !== 200) {
        console.log('1.2)всё пошло по пизде');
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

    console.log('2) после сортировки');
    console.log(result);
    resolve(result);
});

});
}

function createTextField() {
    //var cityList = document.body.querySelector('.cityList');
    var textFieldLabel = document.createElement('label');
    textFieldLabel.textContent = "Поиск по списку городов";
    cityList.appendChild(textFieldLabel);
    var textFieldWrap =  document.createElement('div'); // City Input Wrapper
    textFieldWrap.setAttribute('class', 'input-group');
    cityList.appendChild(textFieldWrap);
    console.warn(textFieldWrap);


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

    textField.addEventListener('keyup', findOnPress);

}

function cityListCreate(value) {
    console.log('Список формируется');
    var tempVal = {
        cityList: value
    };
    var cityHtml = cityRender(tempVal);
    console.log(cityHtml);
    cityList.innerHTML += cityHtml;

    console.log(value);
    for (let i = 0; i < value.length; i++) {
        newCityList[i] = value[i].name;
    }
    console.log(newCityList);
    console.log('Список готов');
}

function tryAgain() {
    console.log('Запустили трай эгэйн')
    var againBut =  document.createElement('button');
    againBut.textContent = 'Попробовать загрузить снова';

    cityList.innerHTML += '<p class="error_msg">Не удалось загрузить список</p>'
    cityList.appendChild(againBut);

    againBut.addEventListener('click', function () {
        console.log('click');
        let url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';
        loadTowns(url)
            .then((value) => {
            console.log('Повторная загрузка успешно завершена');
        cityListCreate(value)
        //cityListCreate(cityHtml);
        var message = document.querySelector('.error_msg');
        //document.removeChild(message);
        //document.removeChild(againBut);
        //console.log('Лишние элементы удалены');
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
}) // закрываем подсказки по клику на пустоте

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

function findOnPress() {
    textField.setAttribute('class', 'form-control city-input');
    console.log("отпустили клавишу");
    //console.log(newCityList);
    findPartial( newCityList, textField.value);
    //console.log(textField.value);
    //console.log(newCityList);
}

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

pageLoader();

loadTowns() // после отправки запроса
    .then(
        (value) => {
            console.log('3) Перед создание поля');
            createTextField();
            console.log('Успешно отгрузили результат');
            cityListCreate(value);
        },
        (value) => {
            tryAgain();
            console.log('Что-то пошло не так, код ошибки: ' + value);
        }
    )



console.log(textField);
