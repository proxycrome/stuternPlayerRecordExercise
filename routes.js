const express = require('express');
const dbClient = require('./database');
const fs = require('fs');
const multer = require('multer');
const uuid = require('uuid');

const avatarName = uuid.v4() + '.jpg'; 

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./avatars")
    },
    filename: (req, file, cb) => {
        cb(null, avatarName)
    }

})
const upload = multer({ storage: fileStorageEngine });

const router = express.Router();


router.post('/player', upload.single('avatar') , async (req, res) => {
    try{
        const { name, position, clubname } = req.body;
        const avatar = req.file.filename;
    
        const query = "INSERT INTO players (name, position, clubname, avatar) VALUES ($1, $2, $3, $4)";
        const values = [name, position, clubname, avatar];
    
        const createUser = await dbClient.query(query, values);
    
        return res.send({message: "Player successfully added"});
    }catch(err){
        console.error(err);
    }

});

router.patch('/player/:id', async (req, res) => {
    try{
        const { name, position, clubname } = req.body;
        const playerId  = +req.params.id;
    
        await dbClient.query(`UPDATE players SET "name" = $1, "position" = $2, "clubname" = $3 WHERE id = $4`, 
        [name, position, clubname, playerId]);
    
        return res.send({message: "Player updated successfully"});
    }catch(error){
        console.error(error);
    }


});

router.put('/player/avatar/:id', upload.single('avatar'), async (req, res) => {
    try{
        const newAvatar = req.file.filename;
        const playerId = req.params.id;
    
        await dbClient.query(`UPDATE players SET "avatar" = $1 WHERE "id" = $2`, [newAvatar, playerId]);
    
        return res.send({message: "Player Avatar Updated"});
    }catch(error){
        console.error(error);
    }

});

router.get('/player/:id', async (req, res) => {
    try{
        const playerId = req.params.id;

        const data = await dbClient.query(`SELECT * FROM players WHERE id = ${playerId}`);

        const { rows } = data;

        return res.send({ data: rows });
    }catch(error){
        console.error(error);
    }
    
})


module.exports = router;