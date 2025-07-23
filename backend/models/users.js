// models/users.js
import { DataTypes, Model } from 'sequelize';

// Definition der Users-Klasse
export class Users extends Model {}

// Initialisierung des Modells
export function initUsers(sequelize) {
  Users.init(
    {
      name: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      expoPushToken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,          // Verbindung zur Datenbank
      tableName: 'users', // Tabellenname
      timestamps: false
    }
  );
}

// Beispiel-Methode: Benutzer hinzufügen
export async function addUser(req, res) {
  try {
    const { name, expoPushToken } = req.body;

    // Prüfen, ob User existiert
    let user = await Users.findByPk(name);

    if (user) {
      // ✅ Existiert -> Token aktualisieren
      user.expoPushToken = expoPushToken;
      await user.save();
      return res.status(200).json({ message: 'User updated', user });
    } else {
      // ✅ Existiert nicht -> neuen anlegen
      user = await Users.create({ name, expoPushToken });
      return res.status(201).json({ message: 'User created', user });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create or update user' });
  }
}

// get token by name
export async function getUser(req, res) {
  try {
    console.log(req.body)
    const name = req.body.name
    console.log(req.body.name)
    const user = await Users.findByPk(name.toString());
    res.status(201).json({token : user.expoPushToken}); // Erfolgreich zurück senden
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create user' });
  }
}
