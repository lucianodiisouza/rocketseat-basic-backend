const express = require("express");
const { v4: uuidv4, validate } = require("uuid");
const app = express();

app.use(express.json());
/**
 * Métodos HTTP
 * GET: Buscar informações
 * POST: Criar uma informação (ou registro)
 * PUT/PATCH: Alterar uma informação já existente no backend
 * DELETE: Apagar uma informação
 *
 */

/**
 * Query Params: Filtros e Paginação => usar ?chave=valor&chave2=valor2
 * Route Params: Identificar recursos ao atualizar ou deletar => usar /:id/
 * Request Body: Enviar informações no corpo da requisição (geralmente json)
 */

/**
 * Middlewares: interceptador de requisições
 *
 */

function logRequests(req, res, next) {
  const { method, url } = req;
  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  return next(); // run the `next` middleware
}

function validateProjectId(req, res, next) {
  const { id } = req.params;
  if (!validate(id)) {
    return res.status(400).json({
      error: "Invalid project ID",
    });
  }

  return next();
}

app.use(logRequests);
app.use("/project/:id", validateProjectId);

const projects = [];
// List all projects
// app.get("/projects", (req, res) => {
//   return res.json(projects);
// });

/*************
 * MY ROUTES
 *************/

/**
 * if you  don't pass any info as query_params
 * all projects will be displayed
 * but if you pass some data, this endpoint will search in title
 * to return results based on title included
 */

app.get("/projects", (req, res) => {
  const { title } = req.query;

  const results = title
    ? projects.filter((project) => project.title.includes(title))
    : projects;

  return res.json(results);
});

// Create a new Project
app.post("/projects", (req, res) => {
  const { title, owner } = req.body;

  const project = { id: uuidv4(), title, owner };
  projects.push(project);

  return res.json(project);
});

// Update a single project
app.put("/projects/:id", (req, res) => {
  const { id } = req.params;
  const { title, owner } = req.body;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return res.status(404).json({ error: "Project not found" });
  }

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return res.json(project);
});

// Delete a specific project
app.delete("/projects/:id", (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return res.status(404).json({ error: "Project not found" });
  }

  projects.splice(projectIndex, 1);

  return res.json({ message: "Project deleted" });
});

/**
 * if your api is running the message bellow
 * will be displayed at your console
 */
app.listen(3333, () => {
  console.log("🚀 Rodando...");
});
