// database.js
import { Sequelize } from 'sequelize';
import { initUsers } from './models/users.js';

export const my_sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'mausyou.db',
});

export async function initDatabase() {
  try {
    // Initialisiere das Users-Modell
    initUsers(my_sequelize);

    // Teste die Verbindung zur Datenbank
    await my_sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Synchronisiere die Datenbank
    await my_sequelize.sync({ force: false });
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
