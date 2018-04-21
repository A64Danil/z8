/**
 * Created by Danil on 19.04.2018.
 */
console.log("NODE JS are working. Тест русских символов");

var friendList = document.body.querySelector('.friendList');
var content = document.body.querySelector('.content');

const friendsTpl = document.querySelector('#friendsTpl').textContent;
const friendsRender = Handlebars.compile(friendsTpl);

VK.init({
    apiId: 6455962
});

function auth() {
    return new Promise( (resolve, reject) => {
            VK.Auth.login(data => {
                if (data.session) {
                    console.log('auth ok');
                    resolve();
                } else {
                    reject(new Error('Не удалось авторизироваться'));
                }
            }, 4 | 8);
    });
}

function callAPI(method, params, version) {
    return new Promise((resolve, reject) => {
        VK.api(method, params, version, (data) => {
            if (data.error) {
                console.log('перед ошибкой');
                reject(data.error);
            } else {
                console.log('перед резолвом');
                resolve(data.response);
            }
        });
    })
}
(async () => {
    console.log('ща');
    await auth();
    const me = callAPI('friends.get', { fields: 'photo_100,photo_200,bdate', v: '5.74'}, (data) => {
        console.log('внутри промиса');
        console.log(data.response);
        listSorter(data.response.items);
        listCreator(data.response); // передаём объект { count: 277, items: [...]}
        // для правильной генерации списка, массив нужно сначала отсортировать и обернуть заново
    })
    console.log('перед ме');
    console.log(me);
    console.log('после ме');
})();


function listSorter(arr) {
    console.log('внутри сортировки');
    arr.sort(function(a,b){
        let newA;
        let newB;
        let tempA;
        let tempB;

        try {
            newA = a.bdate.split('.')
            newB = b.bdate.split('.')

            if (newA[0].length == 1) {
                newA[0] = "0" + newA[0];
            }
            if (newA[1].length == 1) {
                newA[1] = "0" + newA[1];
            }

            if (newB[0].length == 1) {
                newB[0] = "0" + newB[0];
            }
            if (newB[1].length == 1) {
                newB[1] = "0" + newB[1];
            }

            tempA = newA[1] + '.' + newA[0]
            tempB = newB[1] + '.' + newB[0]
        }
        catch(e) {
            console.error(e.message);
        }

        var c = tempA;
        var d = tempB;
        //console.log(tempA, tempB);
        return c-d;
    });
    console.log(arr);
}

function listCreator(arr) {
    console.log('внутри создания списка');
    var friendsHtml = friendsRender(arr);
    content.innerHTML += friendsHtml;
}




// auth()
//     .then(() => {
//         console.log('ща');
//         return callAPI('users.get', { fields: 'photo_100', v: '5.74'}, (data) => {
//             console.log('внутри промиса');
//             console.log(data.response);
//             console.log(data.response[0].first_name);
//             console.log(data.response[0].last_name);
//         })
//     })
//     .then(data => {
//         console.log(data);
//     });

function cityListCreate(value) {
    console.log('Список формируется');
    var tempVal = {
        cityList: value
    };
    var cityHtml = cityRender(tempVal);
    //console.log(cityHtml);
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
    console.log('Твои города:');
    var allCitys = document.querySelectorAll('.cityIco')

    allCitys.forEach(function(item, i, arr) {
        let right = 71 * Math.floor(getRandomArbitary(0, -7));
        let top = 65 * Math.floor(getRandomArbitary(0, -5));
        item.style.backgroundPosition = `${right}px ${top}px`;
    });
    //console.log(allCitys);
}

function getRandomArbitary(min, max) {
    return Math.random() * (max - min) + min;
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

pageLoader()
    .then(
        (value) => {
            console.log('Успех');
        },
        (value) => {
            console.log('Что-то пошло не так, код ошибки: ' + value);
        }
    )

