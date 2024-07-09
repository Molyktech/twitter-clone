export const signup = async (req, res) => {
  res.send("Server is ready");
};

export const login = async (req, res) => {
  res.json({
    data: "You hit the login endpoint!",
  });
};

export const logout = async (req, res) => {
  res.json({
    data: "You hit the logout endpoint!",
  });
};
