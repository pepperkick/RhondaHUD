const Datastore = require('nedb-async').default

const Team = new Datastore({ filename: `${__dirname}/collections/teams.json`, autoload: true });
const Player = new Datastore({ filename: `${__dirname}/collections/players.json`, autoload: true });
const Config = new Datastore({ filename: `${__dirname}/collections/config.json`, autoload: true });

const configId = 'default'

module.exports = async () => {     
    async function AddTeam (team) {
        if (!team) throw new Error('Team is undefined')
        if (!team.name) throw new Error('Team requires a name')
        if (!team.logo) throw new Error('Team requires a logo')

        await Team.asyncInsert(team);
    }

    async function AddPlayer (player) {
        if (!player) throw new Error('Player is undefined')
        if (!player.steamid) throw new Error('Player requires steamid')
        if (!player.name) throw new Error('Player requires a name')

        await Player.asyncInsert(player);
    }

    async function UpdateConfig (key, value) {
        const config = await Config.asyncFindOne({ _id: configId })

        config[key] = value

        await Config.asyncUpdate({ _id: configId }, config)
    }

    return {
        Team: {
            Insert: AddTeam,
            FindOneById: async (_id) => await Team.asyncFindOne({ _id }),
            FindOneByName: async (name) => await Team.asyncFindOne({ name })
        },
        Player: {
            Insert: AddPlayer,
            FindOneBySteamId: async (steamid) => await Player.asyncFindOne({ steamid })
        },
        Config: {
            Update: UpdateConfig,
            Get: async () => await Config.asyncFindOne({ _id: configId })
        }
    }   
}