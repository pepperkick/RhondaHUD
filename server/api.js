const express = require('express')
const config = require('config')
const cors = require('cors')
const bodyParser = require('body-parser')

module.exports = (io) => {
    const Store = require('./store.js')()

    const app = new express()

    app.use(cors())
    app.use(bodyParser.json())
    
    app.get('/team/:id', async (req, res) => {
        const id = req.params.id
        const doc = await Store.Team.FindOneById(id)
    
        res.json(doc)
    })
    
    app.get('/team/name/:name', async (req, res) => {
        const name = req.params.name
        const doc = await Store.Team.FindOneByName(name)
    
        res.json(doc)
    })

    app.get('/team', async (req, res) => {
        const docs = await Store.Team.FindAll()

        res.json(docs)
    })

    app.post('/team', async (req, res) => {
        try {
            const Team = {
                name: req.body.name,
                logo: req.body.logo
            }
    
            const team = await Store.Team.Insert(Team)
    
            console.log(team)
            
            res.status(200).json(team)
        } catch (error) {
            res.status(400).send(error)
        }
    })

    app.get('/player/:steamid', async (req, res) => {
        const steamid = req.params.steamid
        const doc = await Store.Player.FindOneBySteamId(steamid)
    
        res.json(doc)
    })

    app.get('/player', async (req, res) => {
        const docs = await Store.Player.FindAll()

        res.json(docs)
    })

    app.post('/player', async (req, res) => {
        try {
            const Player = {
                name: req.body.name,
                profile_pic: req.body.profile_pic,
                team: req.body.team,
                steamid: req.body.steamid
            }
    
            await Store.Player.Insert(Player)
    
            res.status(200)
        } catch (error) {
            res.status(400).send(error)
        }
    })
    
    app.get('/config/:key', async (req, res) => {
        const key = req.params.key
        const config = await Store.Config.Get()
    
        res.json(config[key])
    })
    
    app.post('/config', async (req, res) => {
        const key = req.body.key
        const value = req.body.value
        const config = await Store.Config.Update(key, value)

        io.sockets.emit('config', config)
    
        res.sendStatus(200)
    })
    
    app.listen(config.get('server.api_port'))
}