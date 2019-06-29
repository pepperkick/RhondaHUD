<template>
    <div class='admin-page' id='team-page'>
        <div class='title' v-if='!teamList'>
            <span>Team Information</span>
            <div class='actionbar'>
                <span @click='OpenTeamList'><i class='fas fa-list'></i></span>
            </div>
        </div>
        <div class='title' v-if='teamList'>
            <span>Team List</span>
            <div class='actionbar'>
                <span @click='CloseTeamList'><i class='fas fa-times'></i></span>
            </div>
        </div>
        <div class='flex mb-4' v-if='!teamList'>
            <div class='team w-1/2 h-12' id='team-blue'>
                <div class='title'>
                    <span>Team Blue</span>
                    <div class='actionbar'>
                        <span><i class='fas fa-trash-alt'></i></span>
                        <span @click='AddTeam'><i class='fas fa-plus'></i></span>
                    </div>
                </div>
                <div class="field">
                    <label class="input-label">Team Name</label>
                    <input class="input" type="text" v-model="team.blu.name" />
                </div>
            </div>
            <div class='team w-1/2 h-12' id='team-red'>
                <div class='title'>
                    <span>Team Red</span>
                    <div class='actionbar'>
                        <span><i class='fas fa-trash-alt'></i></span>
                        <span @click='AddTeam'><i class='fas fa-plus'></i></span>
                    </div>
                </div>
                <div class="field">
                    <label class="input-label">Team Name</label>
                    <input class="input" type="text" v-model="team.red.name" />
                </div>
            </div>
        </div>
    </div>    
</template>

<script>
export default {
    data () {
        return {
            team: {
                blu: {
                    name: '',
                    logo: ''
                },
                red: {
                    name: '',
                    logo: ''
                }
            },
            teams: [],
            teamList: false
        }
    },

    methods: {
        async OpenTeamList () {
            const allteams = await this.$axios.get('/team')

            this.teams = allteams.data
            this.teamList = true
        },

        async CloseTeamList () {
            this.teamList = false
        },
        
        async Update () {
            const active_red = await this.$axios.get('/config/active_teamred')
            const active_blu = await this.$axios.get('/config/active_teamblu')

            const allteams = await this.$axios.get('/team')
            const teamred = await this.$axios.get(`/team/${active_red.data}`)
            const teamblu = await this.$axios.get(`/team/${active_blu.data}`)

            this.teams = allteams.data
            this.team.red = teamred.data
            this.team.blu = teamblu.data
        }
    },

    async created () {
        await this.Update()
    }
}
</script>

<style lang="less">
.title {
    color: @text-color;
    font-size: 24px;
    font-weight: 900;
    text-transform: uppercase;
    margin-left: 32px;
    margin-bottom: 32px;
    display: flex;
    flex-direction: row;

    .actionbar {
        width: 108px;
        margin: auto;
        margin-right: 32px;
        display: flex;
        flex-direction: row;

        span {
            margin-left: auto;
            cursor: pointer;
        }
    }
}
</style>
