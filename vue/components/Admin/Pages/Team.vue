<template>
    <div class='admin-page' id='team-page'>
        <div class='submit-fab' @click="submitData">
            <i class="fas fa-check"></i>
        </div>
        <div class='swap-fab' @click="swapData">
            <i class="fas fa-retweet"></i>
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
            this.team.red.name = this.$parent.config.teamred_name || 'Team RED';
            this.team.blu.name = this.$parent.config.teamblu_name || 'Team BLU';
        },

        async submitData () {
            this.$socket.emit('set-config', 'teamred_name', this.team.red.name || '');
            this.$socket.emit('set-config', 'teamblu_name', this.team.blu.name || '');
        },

        async swapData () {
            this.Update();
            this.$socket.emit('set-config', 'teamred_name', this.team.blu.name || '');
            this.$socket.emit('set-config', 'teamblu_name', this.team.red.name || '');

            const wins1 = this.$parent.config.seriesWinsTeamBlu || 0;
            const wins2 = this.$parent.config.seriesWinsTeamRed || 0;
            this.$socket.emit('set-config', 'seriesWinsTeamBlu', wins2);
            this.$socket.emit('set-config', 'seriesWinsTeamRed', wins1);
        }

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
</style>
