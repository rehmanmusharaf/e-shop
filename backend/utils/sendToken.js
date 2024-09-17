const sendToken = async (user, statuscode, res) => {
  try {
    console.log("Send Token function run!");
    const token = await user.getJwtToken();
    console.log("token is  : ", token);
    // const option = {
    //   expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    //   httpOnly: true,
    // };
    const option = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    // secure: process.env.NODE_ENV === "production", // Set secure flag to true in production
    // sameSite: "None", // Necessary for cross-site requests
    res
      .status(statuscode)
      .cookie("token", token, option)
      .json({ success: true, user, token });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error During token genaration",
      error: error.message,
    });
  }
};

module.exports = sendToken;
