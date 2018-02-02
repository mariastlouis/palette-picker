
$(document).ready(() => {
  setColors();
  getProjects();
  setProjectSelect()
 });

let projects =[];
let palettes = [];
let newAddedProject = null;

const setProjectSelect = () => {
setTimeout (() => {

const projectSelect = projects.map(project => 
`<option class = "color-value" value = ${project.id}> ${project.title} </option>`);
  $('.color-select').html(projectSelect)
  const projectId = $('#project-select').val()
 
  displaySelectProject(projectId)
}, 800)

}


const displaySelectProject = async(projectId) => {
 

$('.selected-project').html('');

const projectTitle = $('#project-select option:selected').text()

const paletteFetch = await fetch(`/api/v1/projects/${projectId}/palettes`);
const paletteObject = await paletteFetch.json();
const paletteArray = paletteObject.palettes
 $('.selected-project').append(`<h3 class = "selected-project-hed"> ${projectTitle} </h3>`)

const setPalette = paletteArray.forEach(palette => 

  $(`.selected-project`).append (`

      <div class= "project-palette" id ="${palette.id}">
      <h4> ${palette.title} </h4>
      <div class = "palette-row">
        <div 
          class = "palette-box1 palette-box"
          style = "background-color: ${palette.color1}">
        </div>
        <div class = "palette-box2 palette-box"
        style = "background-color: ${palette.color2}">
        </div>
          <div class = "palette-box3 palette-box"
          style = "background-color: ${palette.color3}">
          </div>
          <div class = "palette-box4 palette-box"
          style = "background-color: ${palette.color4}"> </div>
          <div class = "palette-box5 palette-box"
          style = "background-color: ${palette.color5}"> </div>
         <img class = "trash-icon delete-btn" src = "images/waste-bin.png"/>
      </div>
        
          </div>
    `)
 )

}


const setColors = () => {
  reloadAnimation();
  const colorNumbers = [1, 2, 3, 4, 5];
  colorNumbers.forEach(number => {
    if(!$(`.color-box${number}`).hasClass('favorite')) {
    let color = generateColors();


    $(`.circle${number}`).css("background-color", color)
    $(`.color-box${number}`).css("background-color", color)
    $(`.hex-code${number}`).text(color.toUpperCase())
  }
  });
}

const reloadAnimation = () => {
  const donut = $('.donut-chart-article')
  const newDonut = donut.clone(true);
  donut.before(newDonut);
  $("." + donut.attr("class") + ":last").remove();
}


const generateColors = () => {
const color = '#'+Math.floor(Math.random()*16777215).toString(16);
return color;
}



const toggleFavorite = (event) => {
  $(event.target).toggleClass('lock-icon')
  $(event.target).parents('.color-box').toggleClass('favorite');
}


const getPalettes = async(projectId, projectTitle) => {
  const paletteFetch = await fetch(`/api/v1/projects/${projectId}/palettes`);
  const paletteObject = await paletteFetch.json();
  const palette = paletteObject.palettes
  palettes.push(...palette)
  appendPalette(projectTitle, palette)

}

const getProjects = async () => {
  const projectFetch = await fetch ('/api/v1/projects');
  const projectObject = await projectFetch.json();
  projects = projectObject.projects
  palettes = [];


  projects.forEach(project => {
    getPalettes(project.id, project.title)
  

  })
}


const appendPalette= (projectTitle, paletteArray) => {

const getTitle = projects.find(project => project.title === projectTitle)
const getId = getTitle.id

 $('.project-container').append(` 

<div class = "project-card" id= ${getId}>
  <h3 class = project-title-hed> ${projectTitle} </h3>
</div>
  `)




 const newPalette = paletteArray.forEach(palette => 

 $(`#${palette.project_id}`).append(`<div class= "project-palette" id ="palette-${palette.id}">
    <h4> ${palette.title} </h4>

    <div class = "palette-row">
      <div 
        class = "palette-box1 palette-box"
        style = "background-color: ${palette.color1}">
      </div>
      <div
        class = "palette-box2 palette-box"
        style = "background-color: ${palette.color2}">
      </div>
      <div
        class = "palette-box3 palette-box"
        style = "background-color: ${palette.color3}">
      </div>
      <div
        class = "palette-box4 palette-box"
        style = "background-color: ${palette.color4}"> </div>
      <div
        class = "palette-box5 palette-box"
        style = "background-color: ${palette.color5}"> </div>
    </div>
  </div>`)
 
)

 }


const appendNewProjectSelect = (projectId, projectTitle) => {
  
  $('.color-select').append(`
    <option class = "color-value" value = ${projectId} selected> ${projectTitle} </option>`)
  displaySelectProject(projectId)
}



const postProject = async () => {
  const newProjectTitle = $('.project-input')
  const newProjectName = newProjectTitle.val();
  const savedProject = await fetch('/api/v1/projects', {
    method: 'POST',
    headers: {
      'CONTENT-TYPE': 'application/json'
    },
    body: JSON.stringify({title: newProjectName})
  })

  const newSelectedProjectId = await savedProject.json()
  const newProjectObject = Object.assign ({}, {title: newProjectName}, newSelectedProjectId)
  appendNewProjectSelect(newProjectObject.id, newProjectName)


  newProjectTitle.val('')


  $('.project-container').html('')
  getProjects()
}

const grabPalette = () => {
  const projectId = parseInt($('#project-select').val())
  const projectTitle = $('#project-select option:selected').text()
  selectedProject = {title: projectTitle, id: projectId}

  const paletteBody = {
    title: $('.palette-input').val(),
    color1: $('.hex-code1').text(),
    color2: $('.hex-code2').text(),
    color3: $('.hex-code3').text(),
    color4: $('.hex-code4').text(),
    color5: $('.hex-code5').text()
  }

  postPalette(projectId, paletteBody)


  
 
  $('.palette-input').val('')
}

const postPalette = async (projectId, palette) => {
 const savedPalette = await fetch(`/api/v1/projects/${projectId}/palettes`, {
    method: 'POST',
    headers: {
      'CONTENT-TYPE': 'application/json'
    },
    body: JSON.stringify(palette)
  })

  const idNewPalette = await savedPalette.json();
  $('.project-container').html('')
  getProjects();
  displaySelectProject(projectId)
  paletteNotification(palette)

}


  const paletteNotification = (palette) => {
  navigator.serviceWorker.controller.postMessage({ 
    type: 'add-palette',
    paletteName: palette.title
  });
}


$('.selected-project').on('click', '.delete-btn', async function() {
  const paletteId = parseInt($(this).parent().parent().attr('id'))
   const deletePalette = await fetch(`api/v1/palettes/${paletteId}`, {
    method: 'DELETE'
  });

  palettes = palettes.filter( palette => palette.id !== paletteId);

  $(this).parent().parent().remove();


 $(`#palette-${paletteId}`).remove();
  // $(`'#palette-${paletteId}'`).remove();

});

$('.save-palette-btn').on('click', grabPalette)
$('.save-project-btn').on('click', postProject)
$('.generate-btn').on('click', setColors)
$('.unlock-icon').on('click', toggleFavorite)

// if('serviceWorker in navigator') {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('../service-worker.js')
//     .then(registration => navigator.serviceWorker.ready)
//     .then(registration => {
//       Notification.requestPermission();

//     }
//   })
// }

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
        
    navigator.serviceWorker.register('../service-worker.js')
      .then(registration => navigator.serviceWorker.ready)
      .then(registration => {
        Notification.requestPermission();
        console.log('ServiceWorker registration successful');
      }).catch(err => {
        console.log(`ServiceWorker registration failed: ${err}`);
      });

  });
}

