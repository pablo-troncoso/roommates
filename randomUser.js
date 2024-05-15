const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

const getRandomUser = async () => {
  try {
    const response = await fetch('https://randomuser.me/api/');
    const data = await response.json();
    const user = data.results[0];

    // Formatear el usuario obtenido según nuestras necesidades
    const formattedUser = {
      id: uuidv4(),
      nombre: `${user.name.first} ${user.name.last}`,
      email: user.email,
      debe: 0,
      recibe: 0,
      total: 0
    };

    return formattedUser;
  } catch (error) {
    throw new Error('Error al obtener un usuario aleatorio');
  }
};

module.exports = { getRandomUser };
