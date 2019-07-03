<template>
    <div class='admin-page' id='team-page'>
        <div class='submit-fab' @click="submitData">
            <i class="fas fa-check"></i>
        </div>
        <div class='title' v-if='!teamList'>
            <span>Team Information</span>
            <div class='actionbar'>
                <!-- <span @click='OpenTeamList'><i class='fas fa-list'></i></span> -->
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
                        <!-- <span><i class='fas fa-trash-alt'></i></span> -->
                        <!-- <span @click='AddTeam(0)'><i class='fas fa-plus'></i></span> -->
                    </div>
                </div>
                <div class="field">
                    <label class="input-label">Team Name</label>
                    <input class="input" type="text" v-model="team.blu.name" />
                </div>
                <!-- <div class="field">
                    <label class="input-label">Team Logo URL</label>
                    <input class="input" type="text" v-model="team.blu.logo" />
                </div> -->
            </div>
            <div class='team w-1/2 h-12' id='team-red'>
                <div class='title'>
                    <span>Team Red</span>
                    <div class='actionbar'>
                        <!-- <span><i class='fas fa-trash-alt'></i></span> -->
                        <!-- <span @click='AddTeam(1)'><i class='fas fa-plus'></i></span> -->
                    </div>
                </div>
                <div class="field">
                    <label class="input-label">Team Name</label>
                    <input class="input" type="text" v-model="team.red.name" />
                </div>
                <!-- <div class="field">
                    <label class="input-label">Team Logo URL</label>
                    <input class="input" type="text" v-model="team.red.logo" />
                </div> -->
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
        async Update () {
            // const active_red = await this.$axios.get('/config/active_teamred')
            // const active_blu = await this.$axios.get('/config/active_teamblu')

            // const allteams = await this.$axios.get('/team')
            // const teamred = await this.$axios.get(`/team/${active_red.data}`)
            // const teamblu = await this.$axios.get(`/team/${active_blu.data}`)

            // this.teams = allteams.data

            const active_red = await this.$axios.get('/config/teamred_name')
            const active_blu = await this.$axios.get('/config/teamblu_name')

            this.team.red.name = active_red.data
            this.team.blu.name = active_blu.data
        },

        async submitData () {
            await this.$axios.post('/config', {
                key: 'teamred_name',
                value: this.team.red.name || ''
            })

            await this.$axios.post('/config', {
                key: 'teamblu_name',
                value: this.team.blu.name || ''
            })
        },

        // async OpenTeamList () {
        //     const allteams = await this.$axios.get('/team')

        //     this.teams = allteams.data
        //     this.teamList = true
        // },

        // async CloseTeamList () {
        //     this.teamList = false
        // },
        
        // async AddTeam (side) {
        //     let team;

        //     if (side) team = this.team.red
        //     else team = this.team.blu

        //     const obj = await this.$axios.post('/team', team)
        // }
    },

    async created () {
        await this.Update()
    }
}
</script>

<style lang="less">
.submit-fab {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 4px solid #fff;
    color: #fff;
    position: fixed;
    bottom: 32px; right: 32px;
    font-size: 24px;
    cursor: pointer;
    display: flex;

    i {
        margin: auto;
    }
}

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
