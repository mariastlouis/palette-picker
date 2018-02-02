const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);


const requireHTTPS = (request, response, next) => {
  if (request.headers['x-forwarded-proto'] !== 'https') {
    return response.redirect('https://' + request.get('host') + request.url);
  }
  next();
};


if (environment === 'production') {
  app.use(requireHTTPS);
} 




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname + '/public')));


app.locals.title = 'Palette Picker';

app.set('port', process.env.PORT || 3000);

app.get('/', (request, response) => {
  response.send('Welcome to Palette Picker');
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

app.get('/api/v1/projects', (request, response) =>{
  database('projects').select()
  .then((projects) => {
    response.status(200).json({projects});
  })
  .catch((error) => {
    response.status(500).json({error})
  })
});

app.get('/api/v1/palettes', (request, response) =>{
  database('palettes').select()
  .then((palettes) => {
    response.status(200).json({palettes});
  })
  .catch((error) => {
    response.status(500).json({error})
  })
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['title']) {
    if(!project[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the required parameter ${requiredParameter}`
      })
    }
  }

  database('projects').insert(project, 'id')
    .then(project => {
      return response.status(201).json({id: project[0]})
    })
    .catch(error => {
      return response.status(500).json({error});
    })
});

app.post('/api/v1/projects/:projectId/palettes', (request, response) =>{
  const {projectId} = request.params;
  const palette = Object.assign({}, request.body, { project_id: projectId});
  for (let requiredParameter of ['title', 'color1', 'color2', 'color3', 'color4', 'color5']) {
    if(!palette[requiredParameter]){
      return response.status(422).json({
        error: `You are missing the required parameter ${requiredParameter}`
      })
    }
  }
  database('palettes').insert(palette, 'id')
  .then(project => {
    return response.status(201).json({id: project[0]})
  })
  .catch(error => {
    return response.status(500).json({error})
  })
});


app.get('/api/v1/projects/:id', (request, response) =>{
  database('projects').where('id', request.params.id).select()
  .then(projects => {
    if(projects.length) {
      return response.status(200).json({projects})
    } else {
      return response.status(404).json({
        error: `Could not find project with id of ${request.params.id}`
      })
    }
  })
  .catch(error => {
    return response.status(500).json({error})
  })
})

app.get('/api/v1/projects/:projectId/palettes', (request, response) =>{
  const {projectId} = request.params;
  database('palettes').where('project_id', projectId).select()
  .then(palettes =>{
    if(palettes.length) {
      return response.status(200).json({palettes})
    } else response.status(404).json({
      error: `Could not find project with an id of ${projectId}`
    })

    
  })
  .catch(error => {
    return response.status(500).json({error})
  })
})

app.get('/api/v1/palettes/:id', (request, response) =>{
  database('palettes').where('id', request.params.id).select()
  .then(palettes => {
    if(palettes.length) {
      return response.status(200).json({palettes})
    } else {
      return response.status(404).json({
        error: `Could not find project with id of ${request.params.id}`
      })
    }
  })
  .catch(error => {
    return response.status(500).json({error})
  })
})


app.delete('/api/v1/palettes/:id', (request, response) => {
  database('palettes').where( 'id', request.params.id).del()
    .then(palette => {
      if (palette) {
        return response.sendStatus(204);
      } else {
        return response.status(422).json({ error: 'Not Found' });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

module.exports = app; // Exports server as app to be used in testing environment

