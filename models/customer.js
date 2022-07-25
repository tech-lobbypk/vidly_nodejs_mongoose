const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
  name: { type: String, required: true, minLength: 5, maxLength: 100 },
});

const Customer = mongoose.model("Customer", customerSchema);

const connect = (callback) => {
  mongoose.connect("mongodb://localhost:27017/vidly", (err) => {
    if (err) {
      return console.log("Connection to mongoDB failed");
    }
    createCustomer("Customer 1");
  });
};
async function createCustomer(cname) {
  const newCustomer = new Customer({ name: cname });
  try {
    await newCustomer.save();
    console.log("Customer saved");
  } catch (exception) {
    console.log("Error in saving the customer");
  }
}

//connect();
module.exports = Customer;
