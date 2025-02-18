import express from 'express';
import cors from 'cors';
import { testUser, addUser } from './models/users.js'
import { createMissRequest, testRequest } from './models/missRequests.js'
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
app.get('/mausyou/user_test', testUser);
app.post('/mausyou/user/add', addUser);

// maus you requests
app.get('/mausyou/req_test', testRequest)

// add maus yous
app.post('/mausyou/add_mausyou', createMissRequest)



/* ------- server starten -------------------- */
initDatabase().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
});
