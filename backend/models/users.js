// models/users.js
import { DataTypes, Model } from 'sequelize';

// Definition der Users-Klasse
export class Users extends Model {}

// Initialisierung des Modells
export function initUsers(sequelize) {
  Users.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      // Weitere Felder hier definieren
    },
    {
      sequelize,          // Verbindung zur Datenbank
      tableName: 'users', // Tabellenname
      timestamps: true,   // Aktiviert `createdAt` und `updatedAt`
    }
  );
}

// Beispiel-Methode: Benutzer hinzufügen
export async function addUser(req, res) {
  try {
    const { name, email } = req.body; // Angenommene Daten aus dem Request
    const user = await Users.create({ name, email });
    res.status(201).json(user); // Erfolgreich erstellt
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create user' });
  }
}

// Beispiel-Methode: Benutzer testen
export async function testUser(req, res) {
  try {
    const user = await Users.findOne({ where: { name: 'Alice Johnson' } });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
