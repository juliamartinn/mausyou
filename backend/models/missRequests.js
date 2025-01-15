// models/missRequests.js
import { DataTypes, Model } from 'sequelize';

export class MissRequests extends Model {}

// Initialisierung des Modells
export function initMissRequests(sequelize) {
  MissRequests.init(
    {
      requester: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',  // Referenziert die Users-Tabelle
          key: 'id',
        },
      },
      requested: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',  // Referenziert die Users-Tabelle
          key: 'id',
        },
      },
    },
    {
      sequelize,              // Verbindung zur Datenbank
      tableName: 'missRequests', // Name der Tabelle
      timestamps: true,       // Aktiviert `createdAt` und `updatedAt`
    }
  );
}

// Methode: Erstelle einen neuen MissRequest
export async function createMissRequest(req, res) {
  try {
    const { requesterId, requestedId } = req.body;

    const newRequest = await MissRequests.create({
      requester: requesterId,
      requested: requestedId,
    });

    res.status(201).json(newRequest); // Erfolgreich erstellt
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create miss request' }); // Fehler an den Client senden
  }
}

// Methode: Teste einen MissRequest
export async function testRequest(req, res) {
  try {
    console.log('called');
    const missRequest = await MissRequests.findOne({
      where: { requester: 1 },
    });

    if (missRequest) {
      console.log(missRequest);
      res.status(200).json(missRequest); // Sende die gefundenen Daten als JSON-Response
    } else {
      res.status(404).json({ message: 'No request with requester id 1' }); // Kein Eintrag gefunden
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' }); // Fehler an den Client senden
  }
}
