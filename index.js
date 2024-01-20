const express = require('express');
const { Deta } = require("deta");

const app = express();
const deta = Deta('b0z61Ay7aZUy_EB8xyjVZ4BZMJvq7itEVKNHjWaPqK3jq');
const db = deta.Base('points2');

app.use(express.json());

// Endpoint to add data to the database


// Endpoint to store data in the database
app.post('/store-db-data', async (req, res) => {
    try {
        const key = Object.keys(req.body)[0];
        const data = req.body[key];

      

        await db.put(data, key);
        console.log("Data stored in the database", data, key);
        res.status(200).json({ message: 'Data stored in the database' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to store data in the database' });
    }
});

// Endpoint to delete data from the database
app.post('/delete-db-data', async (req, res) => {
    try {
        if (!Array.isArray(req.body)) {
            throw new Error('Invalid data format');
        }

        console.log(req.body[0])
        await db.delete(req.body[0]);
        res.status(200).json({ message: 'Data deleted from the database' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete data from the database' });
    }
});

// Endpoint to get data from the database
app.post('/get-db-data', async (req, res) => {
    try {
      console.log(req.body)
        if (!Array.isArray(req.body)) {
            throw new Error('Invalid data format');
        }

        const data = req.body[0]

        const item = await db.get(data);
      console.log("item is", item)
        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get data from the database' });
    }
});

app.get('/get-leaderboard', async (req, res) => {
    try {
        let allData = await db.fetch();
        let leaderboardData = allData.items.filter(item => item.points !== undefined);
        let gradeGroup1 = [];
        let gradeGroup2 = [];
        let gradeGroup3 = [];
        leaderboardData.forEach(item => {
            if (item.gradeGroup === "1") {
                gradeGroup1.push(item);
            } else if (item.gradeGroup === "2") {
                gradeGroup2.push(item);
            } else if (item.gradeGroup === "3") {
                gradeGroup3.push(item);
            }
        });
        gradeGroup1.sort((a, b) => b.points - a.points);
        gradeGroup2.sort((a, b) => b.points - a.points);
        gradeGroup3.sort((a, b) => b.points - a.points);
        gradeGroup1 = gradeGroup1.slice(0, 10);
        gradeGroup2 = gradeGroup2.slice(0, 10);
        gradeGroup3 = gradeGroup3.slice(0, 10);
        leaderboardData = [gradeGroup1, gradeGroup2, gradeGroup3];

        res.status(200).json(leaderboardData);
    }  catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get leaderboard data from the database' });
    }
});


// Endpoint to get data from the database


// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
