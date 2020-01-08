'use-strict';

let allImgObjs;
let keywords = [];

function Img(image_url, title, description, keyword, horns) {
  this.image_url = image_url;
  this.title = title;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;
  allImgObjs.push(this);
}
//gets page one on pageload
$(() => {
  getPageOne();
  console.log('dana',allImgObjs)

});

// EVENT FUNCTIONS //

//handles page link clicks
$('ul').on('click', (e) => {
  if(e.target.text === 'Page 1') {
    getPageOne();
  }
  if(e.target.text === 'Page 2') {
    getPageTwo();
  }
});

//handles filtering
$('select').change((e) => {
  $('section').each(function() {
    if( $(this).attr('id') !== e.target.value) {
      $(this).hide();
    }
    if ( $(this).attr('id') === e.target.value ) {
      $(this).show();
    }
    if ( $(this).attr('class') === e.target.value) {
      $(this).toggle();
    }
  });
});

//handles sorting
$('#sort-by').change(function(e) {
  if(e.target.value === 'title') {
    allImgObjs.sort((a, b) => {
      if(a.title < b.title) {
        return -1;
      }
      if(a.title > b.title) {
        return 1;
      }
      return 0;
    });

    emptyPage();
    renderImages(allImgObjs);
    renderSelectOptions(keywords);
  }

  if(e.target.value === 'horns') {
    allImgObjs.sort((a, b) => {
      return a.horns - b.horns;
    });

    emptyPage();
    renderImages(allImgObjs);
    renderSelectOptions(keywords);
  }
});


// GENERAL FUNTCIONS //

function getPageOne() {
  allImgObjs = [];
  keywords = ['all'];

  emptyPage();

  $.get('./data/page-1.json').done(data => {
    data.forEach(element => {
      new Img(element.image_url, element.title, element.description, element.keyword, element.horns);
    });

    renderImages(allImgObjs);
    renderSelectOptions(keywords);
  });
}

function getPageTwo() {
  allImgObjs = [];
  keywords = ['all'];

  emptyPage();

  $.get('./data/page-2.json').done(data => {

    data.forEach(element => {
      new Img(element.image_url, element.title, element.description, element.keyword, element.horns);
    });

    renderImages(allImgObjs);
    renderSelectOptions(keywords);
  });
}

function emptyPage() {
  let template = $('.placeholder');
  $('main').empty();
  $('main').append(template[0]);

  let optionTemplate = $('option');
  $('select').empty();
  $('select').append(optionTemplate[0]);
}

function renderImages(arr) {
  arr.forEach((element) => {
    let theTemplateScript = $('#image-template').html();

    let theTemplate = Handlebars.compile(theTemplateScript);
    let context = {
      "title": `${element.title}`,
      "image_url": `${element.image_url}`,
      "alt-tag": `${element.title}`,
      "description": `${element.description}`
    }

    let theCompiledHTML = theTemplate(context);
    let template = $('.placeholder');
    let clone = template.clone();
    clone.attr('class', 'all');
    clone.attr('id', `${element.keyword}`);
    clone.html(theCompiledHTML);
    $('main').append(clone[0]);
    clone.show();

    if(!keywords.includes(element.keyword)) {
      keywords.push(element.keyword);
    }
  });
}

function renderSelectOptions(arr) {
  arr.forEach((keyword) => {
    let template = $('option');
    let clone = template.clone();
    
    clone.attr('value', keyword);
    clone.text(keyword);
    $('select').append(clone[0]);
  });
}