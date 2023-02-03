//const { response } = require("express");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const Note = require("./models/note");

app.use(express.static("build"));
app.use(express.json());
app.use(cors());

const requestLogger = (request, response, next) => {
  console.log("Method: ", request.method);
  console.log("Path: ", request.path);
  console.log("Body: ", request.body);
  console.log("----");
  next();
};

app.use(requestLogger);

/*
let notes = [
  { id: 1, content: "HTML is easy", important: true },
  { id: 2, content: "Browser can execute only JavaScript", important: false },
  {
    id: 3,
    content:
      "GET and POST are the most important methods of HTTP protocol - Express Practise file",
    important: true,
  },
];

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);

  if (note) response.json(note);
  else
    response.status(404).send({
      error: `No note with id ${id}`,
    });
});
*/

app.get("/api/notes/", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: "unknown endpoint",
  });
};
/*
const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((note) => note.id)) : 0;

  return maxId + 1;
};
*/
app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then((result) => {
    response.json(result);
  });
});

app.use(unknownEndpoint);

app.delete("/api/notes/:id", (request, response) => {
  console.log(request.params.id);
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
