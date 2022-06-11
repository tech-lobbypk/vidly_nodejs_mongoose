const express = require("express");
const app = express();
const Joi = require("joi");

app.use(express.json());

const schema = Joi.object({
  id: Joi.number().min(1).max(1000).required(),
  title: Joi.string().min(3).max(10).required(),
});

const genres = [
  { id: 1, title: "action" },
  { id: 2, title: "Comedy" },
  { id: 3, title: "Horror" },
];
app.get("/allGenres", (req, res) => {
  console.log("in All Genres");
  console.log(genres);
  console.log(req.query);
  if (req.query.sortBy === `asce`) {
    console.log("sorting");
    genres.sort((a, b) => {
      return b.id - a.id;
    });
  }
  res.send(genres);
});

app.get("/allGenres/:id", (req, res) => {
  const genre = genres.find((genre) => genre.id == req.params.id);
  if (!genre)
    res
      .status(404)
      .send(`Could not find the genre against the id ${req.params.id}`);
  else res.send(genre);
});

app.post("/addGenre", (req, res) => {
  console.log(req.body);
  const newGenre = { id: req.body.id, title: req.body.title };
  genres.push(newGenre);
  res.send(genres);
});

const validateSchema = async (updatedGenre, callback) => {
  const result = await schema.validate(updatedGenre);
  callback(result.error);
};
app.put("/updateGenre/:id", (req, res) => {
  const genre = genres.find((genre) => genre.id == req.params.id);
  if (!genre)
    res
      .status(404)
      .send(
        `Updation failed: Could not find the genre against the id ${req.params.id}`
      );
  else {
    const updatedGenre = { id: req.body.id, title: req.body.title };
    validateSchema(updatedGenre, (err) => {
      if (err) res.send("Invalid object definition" + err);
      else {
        genre.title = updatedGenre.title;
        res.send(genre);
      }
    });
  }
});

app.delete("/deleteGenre/:id", (req, res) => {
  const genre = genres.find((genre) => genre.id == req.params.id);
  if (!genre)
    res
      .status(404)
      .send(
        `Deletion failed: Could not find the genre against the id ${req.params.id}`
      );
  else {
    genres.splice(genres.indexOf(genre), 1);
    res.send(genres);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(3000, (err) => {
  if (err) console.log(`Could not start server. Error: ${err}`);
  else console.log(`Server started on port ${PORT}`);
});
