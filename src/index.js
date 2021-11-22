const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkId(request, response, next){

  const { id } = request.params;
  repositoryIndex = repositories.findIndex(repository => repository.id === id); 

  if (repositoryIndex < 0) {    
    return response.status(404).json({ error: "Repository not found" });
  }  

  request.repositoryIndex = repositoryIndex

  return next()

}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository) 

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checkId, (request, response) => {  
  const updatedRepository = request.body
    
  // retirar se tiver o likes
  delete updatedRepository['likes']
   
  const repositoryIndex = request.repositoryIndex 

  const repository = { ...repositories[repositoryIndex], ...updatedRepository };

  repositories[repositoryIndex] = repository;
  

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", checkId, (request, response) => { 

  const repositoryIndex = request.repositoryIndex   

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkId,(request, response) => {
 
  const repositoryIndex = request.repositoryIndex

  const likes = ++repositories[repositoryIndex].likes;

  return response.status(201).json({'likes':likes});
});

module.exports = app;
