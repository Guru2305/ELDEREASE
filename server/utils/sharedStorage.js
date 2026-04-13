// Shared in-memory storage for consistent data across modules
let users = {
  elders: [],
  volunteers: []
};

export const getUsers = () => users;
export const addUser = (role, userData) => {
  if (role === 'elder') {
    users.elders.push(userData);
  } else if (role === 'volunteer') {
    users.volunteers.push(userData);
  }
  return userData;
};

export const findUserByEmail = (email) => {
  let user = users.elders.find(u => u.email === email);
  if (!user) {
    user = users.volunteers.find(u => u.email === email);
  }
  return user;
};

export const findUserById = (id) => {
  let user = users.elders.find(u => u._id === id);
  if (!user) {
    user = users.volunteers.find(u => u._id === id);
  }
  return user;
};
