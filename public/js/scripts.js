
$(document).ready(() => {
  setColors();
  getProjects();
});

let projects =[];
let palettes = [];


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
  appendSelect()
  palettes = [];
  
  // projects.forEach(project => {
  //   appendProjects(project)
  // })


  projects.forEach(project => {
    getPalettes(project.id, project.title)
  })
}


const getSpecificProject = async (projectId) => {
const projectFetch = await fetch (`/api/v1/projects/${projectId}`);
const projectObject = await projectFetch.json();
const selectedProject = projectObject.projects;
const projectTitle = selectedProject[0].title;
appendPalette(projectTitle, selectedProject)
}


// const displaySavedPalettes = (projectTitle, palette) => {
//   $('.display-projects').append(`<h3>${projectTitle}</h3>`);

//   for (var i = 0; i < palette.length; i++) {
//     $('.display-projects').append(`
//       <div class="saved-palette">
//         <h4>${palette[i].title}</h4>
//         <div class="square-holder">
//           <div class="project-square" style="background-color:${palette[i].color1}"></div>
//           <div class="project-square" style="background-color:${palette[i].color2}"></div>
//           <div class="project-square" style="background-color:${palette[i].color3}"></div>
//           <div class="project-square" style="background-color:${palette[i].color4}"></div>
//           <div class="project-square" style="background-color:${palette[i].color5}"></div>
//         </div>
//         <button class="delete-btn" id=${palette[i].title}>delete</button>
//       </div>
//     `);
//   }
// }

const appendPalette= (projectTitle, paletteArray) => {


 $('.project-container').append(`<h3> ${projectTitle} </h3>`)

 const setPalette = paletteArray.forEach(palette => {

return $(`.project-container`).append (`

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
      </div>
          <img class = "trash-icon delete-btn" src = "images/waste-bin.png"/>
          </div>
    `)
 })
 return setPalette
}

const appendProjects = (project) => {
  console.log(project)
 $('.project-container').append(`
  <article class = "project-article project-${project.id}">
   <h3> ${project.title} </h3>
   <div class = "project-palettes projectId-${project.id}">

   </div>
   </article>`)

}

// const appendProjects = () => {
//   const projectCards = projects.map(project => 
//    `<article class = "project-article project-${project.id}">
//     <h3 class = "project-name"> ${project.title} </h3>
//     <div class = "palette-section-${project.id}">
//     </div>
//    </article>`
//   );
//   $('.blank-project').html(projectCards)
// }


const appendSelect = () => {
  const projectSelect = projects.map(project => 
    `<option class = "color-value" value = ${project.id}> ${project.title} </option>`
  );
  $('.color-select').html(projectSelect)
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
  // const idNewProject = await savedProject.json();
  // const newProject = Object.assign({}, {title: newProjectName}, idNewProject);
  // projects.push(newProject)
  // console.log(projects)
  // appendProjects(newProject);
  // appendSelect()
  // const postedProjectId = await savedProject.json();
  // const projectsFetch = await fetch('/api/v1/projects');
  // const projectObject = await projectsFetch.json();
  // projects = projectObject.projects
  // appendSelect()
  newProjectTitle.val('')
  $('.project-container').html('')
  getProjects()
  

}

const grabPalette = () => {
  const projectId = parseInt($('#project-select').val())
  const selectedProject = projects.find(selectedProj => selectedProj.id === projectId)
    
  
  console.log(selectedProject)
  const paletteTitle = $('.palette-input').val()
  const color_1 = $('.hex-code1').text();
  const color_2 = $('.hex-code2').text();
  const color_3 = $('.hex-code3').text();
  const color_4 = $('.hex-code4').text();
  const color_5 = $('.hex-code5').text();
  $('.palette-input').val('')

  const paletteBody = {
    title: paletteTitle,
    color1: color_1,
    color2: color_2,
    color3: color_3,
    color4: color_4,
    color5: color_5
  }

  postPalette(projectId, paletteBody)
  // const getProject = getSpecificProject(projectId)

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
  // console.log(idNewPalette)
  // const paletteTitle = $('.palette-input').val()
  // const newPalette = Object.assign({}, idNewPalette, {project_id: projectId}, palette )
  // palettes.push(newPalette)

  $('.project-container').html('')
  getProjects();

}

$('.project-container').on('click', '.delete-btn', async function() {
  console.log('palettes before delete', palettes)
  const paletteId = parseInt($(this).parent().attr('id'))
  const deletePalette = await fetch(`api/v1/palettes/${paletteId}`, {
    method: 'DELETE'
  });

palettes = palettes.filter( palette => {
 
  return (palette.id !== paletteId)
});

  console.log('palettes after delete', palettes)
  $(this).parent().remove();
  // const palette = palettes.find(palette => palette.title === paletteTitle);

  // const projectId = palette.project_id;
  // const paletteId = palette.id;

  // const deleteFetch = await fetch(`/api/v1/projects/${projectId}/palettes/${paletteId}`, {
  //   method: 'DELETE'});

  // $(this).parent().remove();
});


$('.save-palette-btn').on('click', grabPalette)
$('.save-project-btn').on('click', postProject)
$('.generate-btn').on('click', setColors)
$('.unlock-icon').on('click', toggleFavorite)

