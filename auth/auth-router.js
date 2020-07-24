const router = require("express").Router();
const Users = require("./auth-model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json({ data: users, jwt: req.jwt });
    })
    .catch((err) => res.send(err));
});

router.post("/register", (req, res) => {
  // implement registration

  const credentials = req.body;

  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const hash = bcryptjs.hashSync(credentials.password, rounds);
    credentials.password = hash;
    // save the user to the database
    Users.add(credentials)
      .then((user) => {
        const token = makeJwt(user);

        res.status(201).json({ data: user, token });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message:
        "please provide username and password and the password shoud be alphanumeric",
    });
  }
});

router.post("/login", (req, res) => {
  //implement login
  const { username, password } = req.body;

  if (isValid(req.body)) {
    Users.findBy({ username: username })
      .then(([user]) => {
        console.log("user", user);
        // compare the password the hash stored in the database
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = makeJwt(user);

          res.status(200).json({ message: "Welcome to our API", token });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message:
        "please provide username and password and the password shoud be alphanumeric",
    });
  }
});

function makeJwt(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const secret = process.env.JWT_SECRET || "is it secret, is it safe?";

  const options = {
    expiresIn: "1h",
  };

  return jwt.sign(payload, secret, options);
}
function isValid(user) {
  return Boolean(
    user.username && user.password && typeof user.password === "string"
  );
}

module.exports = router;
