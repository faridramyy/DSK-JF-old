import userModel from "../../models/user.js";
import bcrypt from "bcrypt";


const security_get = async (req, res) => {
  res.render("admin/security", {
    user: await userModel.findById(req.params.id),
  });
};

const security_put = async (req, res) => {
  const userid = req.params.id;
  const { currentPassword, password } = req.body;
  try {
    const user = await userModel.findById(userid);
    if (!(await bcrypt.compare(currentPassword, user.password)))
      return res.status(401).json({ errMsg: "Wrong current password" });

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    user.save();
    return res.status(200).json({ msg: "done" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true });
  }
};

export default { security_get, security_put };
