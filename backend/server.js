import express from 'express';
import cors from 'cors';
import { addUser, getUser } from './models/users.js'
import { initDatabase } from './database.js'

const app = express()

// prevent error when using web access
app.use(cors());
app.use(express.json());


/* -------- internet auftritt ---------------- */
app.get('/mausyou', (req, res) => {
    res.status(200)
    res.send("maus you <3")
})

/* ----------- api endpoints ----------------- */
// user
app.post('/mausyou/user/add', addUser);
app.post('/mausyou/user/get', getUser);


/* ------- server starten -------------------- */
initDatabase().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
});
