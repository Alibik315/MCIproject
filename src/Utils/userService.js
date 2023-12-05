//MCI
const BASE_URL = 'api/users?page=2'; 

export const getUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/LIST USERS`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};


