const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const object = { 
    id: uuid(), 
    title: request.body.title, 
    url: request.body.url, 
    techs: request.body.techs, 
    likes: 0 
  }

  repositories.push(object);

  return response.json(object);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const index = repositories.findIndex(repo => repo.id === id);
  
  if (index < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const repo = { ...repositories[index], title, url, techs, };

  repositories[index] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex(repo => repo.id === id);

  if (index < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex(repo => repo.id === id);
  
  if (index < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories[index].likes++;

  return response.json(repositories[index]);
});

module.exports = app;
