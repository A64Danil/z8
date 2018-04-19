/* ДЗ 6.1 - Асинхронность и работа с сетью */

/**
 * Функция должна создавать Promise, который должен быть resolved через seconds секунду после создания
 *
 * @param {number} seconds - количество секунд, через которое Promise должен быть resolved
 * @return {Promise}
 */
function delayPromise(seconds) {
    let time = seconds * 1000;
    console.log(time);
    var promise  = new Promise(function(resolve, reject) {
        setTimeout(function(){
            resolve();
        }, time)
    });
   return promise;
}

/**
 * Функция должна вернуть Promise, который должен быть разрешен массивом городов, загруженным из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * Элементы полученного массива должны быть отсортированы по имени города
 *
 * @return {Promise<Array<{name: String}>>}
 */
function loadAndSortTowns() {

    return new Promise ((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');
        xhr.send();
        xhr.addEventListener('load', () => {
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
            // for (let i = 0; i < result.length; i++) {
            //
            //
            // }
            console.log(result[0]);
            resolve(result);
        });

    });
}


loadAndSortTowns()
    .then( (value) => {
        console.log(value);
    })

export {
    delayPromise,
    loadAndSortTowns
};
