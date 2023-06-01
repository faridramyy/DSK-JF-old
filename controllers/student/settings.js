import jwt from "jsonwebtoken";
import userModel from "../../models/user.js";

export const settings_get = (req, res) => {
  const token = req.cookies.jwt; // Assuming the token is stored in a cookie named 'jwt'

  if (token) {
    jwt.verify(token, process.env.jwtSecretPhrase, (err, decodedToken) => {
      if (err) {
        // Token is invalid or expired
        console.log(err);
        res.redirect("/login"); // Redirect the user to the login page
      } else {
        const userId = decodedToken.user._id; // Extract the user ID from the token
        // Fetch the user details from the database using the user ID
        userModel
          .findById(userId)
          .then((user) => {
            // Render the settings page with the user data
            res.render("student/settings", { user });
          })
          .catch((err) => {
            console.log(err);
            res.redirect("/login");
          });
      }
    });
  } else {
    // Token is not provided
    res.redirect("/login"); // Redirect the user to the login page
  }
};

export const settings_put = (req, res) => {
  const token = req.cookies.jwt; // Assuming the token is stored in a cookie named 'jwt'
  const { role, firstName, lastName, username } = req.body;

  if (token) {
    jwt.verify(token, process.env.jwtSecretPhrase, (err, decodedToken) => {
      if (err) {
        // Token is invalid or expired
        console.log(err);
        res.status(401).json({ errMsg: "Invalid or expired token" });
      } else {
        const userId = decodedToken.user._id; // Extract the user ID from the token
        // Find the user in the database using the user ID
        userModel.findById(userId)
          .then((user) => {
            if (user.role === "student") {
              // Check if the username already exists for another user
              userModel.findOne({ username: username })
                .then((existingUser) => {
                  if (existingUser && existingUser._id.toString() !== userId) {
                    // Username already taken
                    res.status(400).json({ errMsg: "Username already taken" });
                  } else {
                    // Update the user's settings
                    userModel.findOneAndUpdate(
                      { _id: userId },
                      { role, firstName, lastName, username }
                    )
                      .then(() => {
                        res.json({ msg: "Settings updated successfully" });
                      })
                      .catch((err) => {
                        console.error(err);
                        res.status(500).json({ errMsg: "Internal server error" });
                      });
                  }
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).json({ errMsg: "Internal server error" });
                });
            } else {
              res.status(403).json({ errMsg: "Access forbidden" });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(404).json({ errMsg: "User not found" });
          });
      }
    });
  } else {
    // Token is not provided
    res.status(401).json({ errMsg: "Authorization token missing" });
  }
};
