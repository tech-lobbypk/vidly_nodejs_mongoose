const { default: mongoose, model, mongo } = require("mongoose");

const connect = (callback) => {
  mongoose.connect("mongodb://localhost:27017/vidly", (err) => {
    if (err) {
      return console.log("Connection to mongoDB failed");
    }
    updateMovie();
  });
};

const genreSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, minLength: 5 },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: { type: Number, required: true, min: 0, max: 500 },
  dailyRentalRate: { type: Number, required: true, min: 0, max: 3000 },
});

const Movie = new model("Movie", movieSchema);

function createMovie() {
  const newMovie = new Movie({
    title: "The Capital",
    numberInStock: 10,
    dailyRentalRate: 200,
    genre: { title: "Sci-fi" },
  });
  newMovie.save((err) => {
    if (err) console.log("Error saving document");
    else console.log("Sucesfully saved movie data");
  });
}

async function updateMovie() {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      "62c6697a37110f7a8da89a89",
      {
        title: "The Stars",
      },
      { new: true }
    );
    console.log(updatedMovie);
  } catch (exception) {
    console.log("Exception while updating movie");
  }
}
//connect();

module.exports = Movie;
