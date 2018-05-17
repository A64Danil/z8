/**
 * Created by Danil on 19.04.2018.
 */
console.log("NODE JS are working. Тест русских символов");

var cityList = document.body.querySelector('.cityList');

var newCityList = []; // City List with hints
var findCity = []; // Resulf of maching

var textField =  document.createElement('input'); // City Input

var textFieldHintsWrap =  document.createElement('div'); // Place for Hints
var textFieldClear =  document.createElement('div'); // Clear value of text field

var resCountWrap = document.createElement('div'); // Count results of search

const cityTpl = document.querySelector('#city-tpl').textContent;
const cityRender = Handlebars.compile(cityTpl);

const cityItemTpl = document.querySelector('#cityItem-tpl').textContent;
const cityItemRender = Handlebars.compile(cityItemTpl);

function addElement(tag, className, textContent, attributes, place = document.body, before) {
    var el = document.createElement(tag);
    if (className != null) el.setAttribute('class', className);
    if (textContent != null) el.textContent = textContent;

    if (attributes != null) {
        if (!(attributes instanceof Array)) {
            console.warn('вы передаёте ' + attributes + ', a нужно передавать массив объектов типа [{ attrName1 : attrValue}, { attrName2 : attrValue}]');
        }
        else if (attributes.length > 0) {
            console.log();
            for (var i = 0; i < attributes.length; i++ ) {
                let currentKey = Object.keys(attributes[i]);
                console.log('были переданы параметры, ' + attributes.length + ' шт.; Name: ' + currentKey[0] + ', ' +
                    'value: ' + attributes[i][currentKey[0]]); // name + value
                el.setAttribute(currentKey[0], attributes[i][currentKey[0]]);
            }

        }
    }
    before ? document.body.insertBefore(el, place) :  place.appendChild(el);
}

function loadTowns(url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities2.json') {
    console.log('1) Пытаемся загрузить города отсюда: ' + url)
    return new Promise ((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();
        xhr.addEventListener('load', () => {

            if (xhr.status !== 200) {
                console.log('1.2) Что-то пошло не так!');
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

            console.log('2) После сортировки городов');
            console.log(result);
            resolve(result);
        });

    });
}

function createTextField() {
    console.log('3.1) внутри createTextField')
    var content = document.body.querySelector('.content');
    var textFieldLabel = document.createElement('label');
    textFieldLabel.textContent = "Поиск по списку городов";

    cityList.insertBefore(textFieldLabel, content);
    var textFieldWrap =  document.createElement('div'); // City Input Wrapper
    textFieldWrap.setAttribute('class', 'input-group');
    cityList.insertBefore(textFieldWrap, content);


    textField.setAttribute('type', 'text');
    textField.setAttribute('class', 'form-control city-input closed');
    textField.setAttribute('placeholder', 'Введите название города');
    textFieldWrap.appendChild(textField);

    textFieldClear.setAttribute('class', 'textFieldClear');
    textFieldClear.textContent = 'отчистить'
    resCountWrap.setAttribute('class', 'count-results');
    textFieldWrap.appendChild(resCountWrap);
    textFieldWrap.appendChild(textFieldClear);

    textFieldClear.addEventListener('click', function (e) {
        textField.value = '';
        resCountWrap.textContent = null;
        findPartial(newCityList, textField.value);
    })

    console.log('3.2) Перед добавлением события keyup')
    textField.addEventListener('keyup', findOnPress);

}

function cityListCreate(value) {
    console.log('Список формируется');
    var tempVal = {
        cityList: value
    };
    var cityHtml = cityRender(tempVal);
    cityList.innerHTML += cityHtml;

    console.log(value);
    for (let i = 0; i < value.length; i++) {
        newCityList[i] = value[i].name;
    }
    console.log(newCityList);
    console.log('Список готов');

    iconRadomizer();
}

function iconRadomizer() {
    var allCitys = document.querySelectorAll('.cityIco')

    allCitys.forEach(function(item, i, arr) {
        let right = 71 * Math.floor(getRandomArbitary(0, -7));
        let top = 65 * Math.floor(getRandomArbitary(0, -5));
        item.style.backgroundPosition = `${right}px ${top}px`;
    });
}

function getRandomArbitary(min, max) {
    return Math.random() * (max - min) + min;
}

function tryAgain() {
    console.log('Запустили трай эгэйн');

    cityList.innerHTML += '<p class="error_msg">Не удалось загрузить список!</p>';
    cityList.innerHTML += '<p class="try_msg">Попробовать загрузить снова <span class="newUrl"></span></p>';
    addElement('select', 'listOfLoads', 'Варианты загрузки', null, cityList);
    var listOfLoads =  document.querySelector('.listOfLoads');

    addElement('option', null, 'Список с битой ссылкой', [
        { 'value' : 'http://yandex.ru' }
    ], listOfLoads);
    addElement('option', null, 'Классический список из 50 городов', [
        { 'value' : 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json' }
    ], listOfLoads);
    addElement('option', null, 'Новый список из 20 городов', [
        { 'value' : 'http://pro.qoobeo.ru/acf-tpl/cities20.json' }
        ], listOfLoads);
    addElement('option', 'shortList', 'Новый короткий список из 10 городов', [
        { 'value' : 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities3.json' }]
        , listOfLoads);

    addElement('button', 'againBut', 'Попробовать загрузить снова', [{value : 'http://yandex.ru'}], cityList)

    var againBut = document.querySelector('.againBut')

    againBut.addEventListener('click', function () {
        showLoader('showAgain');
        console.log('click, ' + againBut.value);
        let url = againBut.value;
        loadTowns(url)
            .then((value) => {
                console.log('Повторная загрузка успешно завершена');
                cityListCreate(value);
                var message = document.body.querySelector('.error_msg');
                var againBut = document.body.getElementsByTagName('button');
                cityList.removeChild(message);
                cityList.removeChild(againBut[0]);
                cityList.removeChild(document.body.getElementsByTagName('select')[0]);
                cityList.removeChild(document.body.querySelector('.try_msg'));
                console.log('Лишние элементы удалены');
                console.log('3) Перед создание поля (внутри tryAgain)');
                createTextField();
                },
                (value) => {
                console.log('Повторная загрузка, код ошибки: ' + value);
                }
            )
            .then(
                () => {
                    console.log('4) Then в конце TryAgain');
                    removeLoader();
                }
            );
    })

}

document.body.addEventListener('click', function () {
    textField.setAttribute('class', 'form-control city-input closed');
    resCountWrap.textContent = null;
}) // закрываем подсказки по клику на пустоте

document.body.addEventListener('click', function (e) {
    if (e.target.tagName === 'LI') {
        block = e.target;
        textField.value = block.dataset.name;
        findOnPress();
    }
    else  if (e.target.parentNode.tagName === 'LI') {
        block = e.target.parentNode;
        textField.value = block.dataset.name;
        findOnPress();
    }


    //textField.addEventListener('keyup', findOnPress);

}, false)

document.body.addEventListener('click', function (e) {
    if (e.target.tagName === 'SELECT') {
        document.querySelector('.againBut').value = e.target.selectedOptions[0].value;
        document.querySelector('.newUrl').textContent = "(new URL: " + e.target.selectedOptions[0].value + ")";
    }
}, false)

function findPartial( arr, ell ) {
    var content = document.body.querySelector('.content');
    let tepmArr = [];
    let finArr;

    var regex = new RegExp(ell, 'i');
    var resCount = 0;

    while (content.firstChild) {
        console.log("Чистим контейнер от старых")
        content.removeChild(content.firstChild);
    }

    for (let i = 0; i < arr.length; i++) { // Заполняем подсказками
        if (arr[i].match(regex) ) {
            let curItem = { name : arr[i] }
            tepmArr.push(curItem);
            resCount++;
            //console.log("Точное совпадение, " + arr[i])
        }
    }
    var tempVal = {
        cityItemList: tepmArr
    };
    finArr = cityItemRender(tempVal);
    content.innerHTML += finArr;
    iconRadomizer();
    console.log(tepmArr);
    resCountWrap.textContent = "(найдено: " + resCount + " )";
}

function findOnPress() {
    textField.setAttribute('class', 'form-control city-input');
    console.log("отпустили клавишу");
    findPartial( newCityList, textField.value);
}

// TODO: сделать правильную загрузку лоадера
// function pageLoader() {
//     return new Promise ((resolve) => {
//         var loadWrap =  document.body.querySelector('.loader-wrap');
//         window.addEventListener('load', function () {
//            document.body.removeChild(loadWrap);
//            loadText = null;
//            loadWrap = null;
//            resolve();
//        });
//     });
// }

// pageLoader();

loadTowns() // после отправки запроса
    .then(
        (value) => {
            console.log('Успешно отгрузили результат');
            cityListCreate(value);
            console.log('3) Перед создание поля');
            createTextField();
        },
        (value) => {
            tryAgain();
            console.log('Что-то пошло не так, код ошибки: ' + value);
        }
    )
    .then(
        () => {
            console.log('4) Then в конце');
        }
    )

