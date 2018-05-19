/**
 * Created by Danil on 19.04.2018.
 */
console.log("NODE JS are working. Тест русских символов");
__QL_simpleLoad = false;

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
        listCreator(data.response);
        seasonColor();
    })
    console.log('перед ме');
    console.log(me);
    console.log('после ме');
    removeLoader();
})();


function listSorter(arr) {
    console.log('внутри сортировки');
    arr.sort(function(a,b){
        let newA;
        let newB;
        try {
            newA = getBday(a.bdate);
            newB = getBday(b.bdate);
            //console.log(newA, newB);
        }
        catch(e) {
            console.error(e.message);
        }
        var c = newA;
        var d = newB;
        return c-d;
    });
    console.log(arr);
}

function getBday(date) {
    //console.log(date);
    let newDate = date.split('.')
    
    var now = new Date();
    var start = new Date(now.getFullYear(), (newDate[1] - 1), newDate[0]);
    var diff = start - now;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    if (day < 0) {
        //console.log('Исправляем отрицательное ' + day);
        day += 365;
    }
    //console.log('Количество дней до ДР: ' + day);
    return day;
}

function listCreator(arr) {
    console.log('внутри создания списка');
    var friendsHtml = friendsRender(arr);
    content.innerHTML += friendsHtml;
}


function seasonColor() {
    console.log('внутри отрисовки сезонов');
    let temp = document.querySelectorAll('.singleFriend');

    temp.forEach(function(item, i, arr) {
        let dataReal = item.dataset.bday.split('.');
        let generatedClassName = 'mounth' + dataReal[1];
        //console.log(dataReal);
        item.setAttribute('class', generatedClassName);
    });

    //console.log(temp);
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


//
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
//
// pageLoader()
//     .then(
//         (value) => {
//             console.log('Успех');
//         },
//         (value) => {
//             console.log('Что-то пошло не так, код ошибки: ' + value);
//         }
//     )

