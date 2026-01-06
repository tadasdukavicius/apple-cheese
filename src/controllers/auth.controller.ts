import { users } from "../data/mockUsers.js";

export const login = (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.json({ message: "Invalid credentials" });

  //token
  res.json({ token: "dummy-jwt-token", user: { id: user.id, name: user.name, email: user.email } });
};

export const me = (req, res) => {
  res.json({ id: 1, name: "John Doe", email: "test@example.com" });
};