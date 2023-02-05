const { response } = require("express");
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
  console.log("get fired!");
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
app.post("/api/notes", (request, response, next) => {
  const body = request.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

app.get("/api/notes/:id", (request, response, next) => {
  console.log("get with ID fired!");
  Note.findById(request.params.id)
    .then((note) => {
      if (note) response.json(note);
      else response.status(404).end();
    })
    .catch((error) => next(error));
});

app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then((result) => {
      console.log(result);
      response.send(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/notes/:id", (request, response, next) => {
  const { content, important } = request.body;

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { runValidators: true, context: "query", new: true }
  )
    .then((updatedNote) => response.json(updatedNote))
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({
      error: "malinformed id",
    });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
