import express from 'express';
import { testUser, addUser } from './models/users.js'
import { testRequest } from './models/missRequests.js'
import { initDatabase } from './database.js'


const app = express()


/* -------- internet auftritt ---------------- */
app.get('/mausyou', (req, res) => {
    res.status(200)
    res.send("maus you <3")
})

/* ----------- api endpoints ----------------- */
// user
app.get('/mausyou/user_test', testUser);
app.get('/mausyou/user/add', addUser);

// maus you requests
app.get('/mausyou/req_test', testRequest)


/* ------- server starten -------------------- */
initDatabase().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
});
