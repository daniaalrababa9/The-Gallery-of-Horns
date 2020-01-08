'use strict ';

let imgObj;
function Horns(data) {
    this.url = data.image_url;
    this.title = data.title;
    this.description = data.description
    this.keyword = data.keyword;
    this.horns = data.horns;
    Horns.all.push(this)
}
Horns.all = [];
// Horns.prototype.render=function(){
// let hornOutput=$('<div></div>');
// hornOutput.addClass(this.keyword)
// let template=$('#photo-template').html();
// hornOutput.html(template);
// hornOutput.find('h2').text(this.title)
// hornOutput.find('img').attr('src',this.url).attr('alt',this.description);
// hornOutput.find('p').text(`Number of horns${this.horns}`)
// $('main').append(hornOutput);

// }
Horns.prototype.render = function () {
    let hornOutput = $('<div></div>');
    hornOutput.addClass(this.title)
    hornOutput.addClass(this.keyword)
    let templateMarkup = $('#neighborhood-template').html();
    let template = Handlebars.compile(templateMarkup);
    let output = template(this);
    hornOutput.html(output);

    $('#photo-template').append(hornOutput)

}

function selectBox() {
    let seen = {};
    Horns.all.forEach(horn => {
        if (!seen[horn.keyword]) {
            $('select').append(`<option value=${horn.keyword}>${horn.keyword}</option>`)
            seen[horn.keyword] = true;
        }
    })
}
$('ul').on('click', function (e) {
    let value = e.target.text;
    if (value === 'Page 1') {
        pageOne();
    } if (value === 'Page 2') {
        pageTwo();
    }

})

$('select').on('change', function () {
    let selected = $(this).val();
    console.log('sssssss', selected)
    $('div').hide();
    $(`.${selected}`).fadeIn();
})

$('#sort-by').change(function (e) {
    let value = e.target.value;
    if (value === 'title') {
        Horns.all.sort((a, b) => {
            if (a.title < b.title) {
                return -1;
            } if (a.title > b.title) {
                return 1;
            } if (a.title === b.title) {
                return 0;
            }
        })
    }
    $('div').hide();
    renderImg(Horns.all);
    if (value === 'horns') {
        Horns.all.sort((a, b) => {
            return a.horns - b.horns
        })
    }
    $('div').hide();
    renderImg(Horns.all);
})
function renderImg(arr) {
    arr.forEach(val => {
        let hornOutput = $('<div></div>');
        hornOutput.addClass(val.title)
        hornOutput.addClass(val.keyword)
        let templateMarkup = $('#neighborhood-template').html();
        let template = Handlebars.compile(templateMarkup);
        let output = template(val);
        hornOutput.html(output);

        $('#photo-template').append(hornOutput)
    })
}

function pageOne() {
    Horns.all = [];
    $('div').hide();

    $.get('./data/page-1.json')
        .then(data => {
            data.forEach(thing => {
                let horn = new Horns(thing);
                horn.render();
            });
        })
        .then(() => {
            selectBox();
        })
}
$(() => {
    pageOne();
})
function pageTwo() {
    Horns.all = [];
    $('div').hide();

    $.get('./data/page-2.json')
        .then(data => {
            data.forEach(thing => {
                let horn = new Horns(thing);
                horn.render();
            });
        })
        .then(() => {
            selectBox();
        })
}