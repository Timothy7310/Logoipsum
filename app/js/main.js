
document.addEventListener('DOMContentLoaded', function() {

    // БУРГЕР
    document.querySelector('#burger').addEventListener('click', function(e){
        document.querySelector('body').classList.toggle('lock');
        document.querySelector('.header__burger').classList.toggle('active');
        document.querySelector('.header__nav').classList.toggle('active');
        let span = document.querySelectorAll('.header__burger-span');
        for (let i = 0; i < span.length; i++){
            span[i].classList.toggle('active');
        }
    });
    // $('#burger').click(function (event) {
    //     $('.header__burger, .header__burger-span, .header__nav').toggleClass('active');
    //     $('body').toggleClass('lock');
    // });



    // СЛАЙДЕР

    const swiperComments = new Swiper('.comments-slider', {

        loop: true,

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },

        watchSlidesVisibility: true,
        breakpoints: {
                // when window width is >= 320px
            992: {
                slidesPerView: 3,
            },
            767: {
                slidesPerView: 1,
                
            },
        },
        centeredSlides: true
    });



    // КАРТА
    let spinner = document.querySelector('.loader');
    let checkLoad = 0;
    let placemarks = [
        {
            latitude: 45.047883,
            longitude: 38.979382,
            hintContent: '<div class="map__hint">ул. Красная, д. 182</div>',
        },
    ],
    geoObjects = [];


    function init () {
        let myMap = new ymaps.Map("map-yandex", {
            center: [45.047883, 38.979382],
            zoom: 14,
            controls: ['zoomControl'],
            behaviors: ['drag']
        });

        for (let i = 0; i < placemarks.length; i++) {
            geoObjects[i] = new ymaps.Placemark([placemarks[i].latitude, placemarks[i].longitude], 
            {
                hintContent: placemarks[i].hintContent,
            },
            {
                iconLayout: 'default#image',
                iconImageHref: '../img/Contacts-us/pin.svg',
                iconImageSize: [50, 50],
                iconImageOffset: [-25, -50] 
            });
        }
        let clusterer = new ymaps.Clusterer({

        });
        myMap.geoObjects.add(clusterer);
        clusterer.add(geoObjects);

        //Получаем первый экземпляр коллекции слоев, потом первый слой коллекции
        let layer = myMap.layers.get(0).get(0);

        //Решение по callback-у для определния полной загрузки карты: http://ru.stackoverflow.com/questions/463638/callback-загрузки-карты-yandex-map
        waitForTilesLoad(layer).then(function() {
            //Скрываем
            spinner.classList.remove('is-active');
        });
    }

    function waitForTilesLoad(layer) {
        return new ymaps.vow.Promise(function (resolve, reject) {
            let tc = getTileContainer(layer), readyAll = true;
            tc.tiles.each(function (tile, number) {
                if (!tile.isReady()) {
                    readyAll = false;
                }
            });
            if (readyAll) {
                resolve();
            } else {
                tc.events.once("ready", function() {
                    resolve();
                });
            }
        });
    }

    function getTileContainer(layer) {
        for (let k in layer) {
            if (layer.hasOwnProperty(k)) {
                if (layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer || layer[k] instanceof ymaps.layer.tileContainer.DomContainer) {
                    return layer[k];
                }
            }
        }
        return null;
    }

    function loadScript(url, callback){

        let script = document.createElement("script");

        if (script.readyState){  //IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {  //Другие браузеры
            script.onload = function(){
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    let ymap = function() {
        document.querySelector('.ymap-container').addEventListener('mouseenter', () => {
            if (checkLoad == 0) {
                checkLoad = 1;
                spinner.classList.add('is-active');

                loadScript("https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;loadByRequire=1", function(){
                    ymaps.load(init);
                });         
            }
        });
    };

    ymap();

}, false);



