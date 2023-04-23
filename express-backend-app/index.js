const express = require("express");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
require("dotenv").config();

const app = express();
app.use(express.json());

const USERS = [];

const QUESTIONS = [
  {
    id: 1,
    title: "Max of an Array",
    description: "Given an array, return the maximum value.",
    testCases: [
      { input: "[1, 2, 3, 4, 5]", output: "5" },
      { input: "[10, 20, 30, 40, 50]", output: "50" },
      { input: "[-1, -2, -3, -4, -5]", output: "-1" },
      { input: "[5, 4, 3, 2, 1]", output: "5" },
      { input: "[1, 3, 5, 7, 9, 2, 4, 6, 8, 10]", output: "10" },
    ],
  },
  {
    id: 2,
    title: "Average of an Array",
    description:
      "Given an array, return the average value rounded to two decimal places.",
    testCases: [
      { input: "[1, 2, 3, 4, 5]", output: "3.00" },
      { input: "[10, 20, 30, 40, 50]", output: "30.00" },
      { input: "[-1, -2, -3, -4, -5]", output: "-3.00" },
      { input: "[5, 4, 3, 2, 1]", output: "3.00" },
      { input: "[1, 3, 5, 7, 9, 2, 4, 6, 8, 10]", output: "5.50" },
    ],
  },
  {
    id: 3,
    title: "Factorial",
    description: "Given an integer, return the factorial of that number.",
    testCases: [
      { input: "5", output: "120" },
      { input: "10", output: "3628800" },
      { input: "0", output: "1" },
      { input: "1", output: "1" },
      { input: "6", output: "720" },
    ],
  },
  {
    id: 4,
    title: "Fibonacci",
    description:
      "Given an integer n, return the nth number in the Fibonacci sequence.",
    testCases: [
      { input: "0", output: "0" },
      { input: "1", output: "1" },
      { input: "2", output: "1" },
      { input: "5", output: "5" },
      { input: "10", output: "55" },
    ],
  },
  {
    id: 5,
    title: "Palindrome",
    description: "Given a string, determine if it is a palindrome.",
    testCases: [
      { input: "racecar", output: true },
      { input: "hello", output: false },
      { input: "A man a plan a canal Panama", output: true },
      { input: "Was it a car or a cat I saw?", output: true },
      { input: "not a palindrome", output: false },
    ],
  },
];

const SUBMISSIONS = [];

const doesEmailExist = (email) => {
  const usersWithExistingEmail = USERS.filter((user) => user.email === email);
  if (usersWithExistingEmail.length === 0) return false;
  return true;
};

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_PRIVATE_KEY);
};

const generateResult = () => {
  if (Math.random() < 0.5) return "pass";
  return "fail";
};

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.post("/signup", (req, res) => {
  // add logic to decode body
  console.log(req.body);

  // body should have email and password
  const { email, password } = req.body;

  // store email and password (as is for now) in the
  // USERS array above (only if the user with the given email doesn't exsits)
  if (!doesEmailExist(email)) {
    const newUser = { _id: uuid(), email, password };
    USERS.push(newUser);
    // return back 200 status code to the client
    res.status(200).send({ message: "You are successfully signed up" });
  } else {
    res.status(400).send({ message: "You are already registered" });
  }
});

app.post("/login", (req, res) => {
  // add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  if (doesEmailExist(email)) {
    // Also ensure the password is the same
    const user = USERS.find((user) => user.email === email);

    // if the password is same, return back 200 status code to the client
    if (user.password === password) {
      // Also send back a token (any random string will do for now)
      const token = generateToken(user._id);
      res
        .status(200)
        .send({ message: "You are successfully logged in", token });
    } else {
      // if password is incorrect
      res.status(400).send({ message: "Invalid passowrd" });
    }
  } else {
    // if the password is not correct, return back 401 status code to the client
    res.status(400).send({ message: "You have to signup first" });
  }
});

app.get("/questions", (req, res) => {
  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
});

app.get("/submissions", (req, res) => {
  // return the users submissions for this problem
  res.send(SUBMISSION);
});

app.post("/submissions", (req, res) => {
  // let the user submit a problem, randomly accept or reject the solution
  const { solution } = req.body;
  const newSubmission = { solution, result: generateResult() };
  // Store the submission in the SUBMISSIONS array above
  SUBMISSIONS.push(newSubmission);
  res.send({ message: "Your submission is successfully submitted" });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
