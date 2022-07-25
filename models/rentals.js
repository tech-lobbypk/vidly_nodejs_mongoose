const mongoose = require("mongoose");
const Movie = require("./movie");
const Customer = require("./customer");
const Fawn = require("fawn");

const rentalSchema = new mongoose.Schema({
  movie: {
    type: new mongoose.Schema({
      title: { type: String, required: true, minLength: 5 },
      dailyRentalRate: { type: Number, required: true, min: 0, max: 3000 },
    }),
    required: true,
  },
  customer: {
    type: new mongoose.Schema({
      name: { type: String, required: true, minLength: 5, maxLength: 100 },
    }),
    required: true,
  },
  rentalDate: { type: Date, default: Date.now, required: true },
  returnDate: { type: Date },
});

const Rental = mongoose.model("Rental", rentalSchema);

const connect = (callback) => {
  mongoose.connect("mongodb://localhost:27017/vidly", (err) => {
    if (err) {
      return console.log("Connection to mongoDB failed");
    }

    Fawn.init("mongodb://localhost:27017/vidly");
    createRental("62c6697a37110f7a8da89a89", "62c6b30b0743bcf4bb74c67d");
  });
};

async function createRental(movieId, customerId) {
  const movieObj = await Movie.findOne({ _id: movieId });
  const customerObj = await Customer.findOne({ _id: customerId });
  console.log(movieObj.title);
  console.log(customerObj.name);
  const newRental = new Rental({
    movie: { title: movieObj.title, dailyRentalRate: movieObj.dailyRentalRate },
    customer: { name: customerObj.name },
  });
  /*try {
    await newRental.save();
    console.log("Saved rental");
  } catch (ex) {
    console.log("Exception in saving rental");
  }*/
  movieObj.numberInStock--;
  try {
    new Fawn.Task()
      .save("rentals", newRental)
      .update(
        "movies",
        { _id: movieObj._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();
  } catch (exception) {
    console.log(exception);
  }
}

connect();
