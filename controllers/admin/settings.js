export const settings_get = (req, res) => {
  res.render("admin/settings");
};

export const settings_post = async (req, res) => {
  const { firstName, lastName, email } = req.body;
  try {
    userModel
      .findOneAndUpdate({ username: "admin" }, { firstName, lastName, email })
      .then(() => {
        return res.json({ msg: "done" });
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (err) {
    console.log(err);
  }
};
