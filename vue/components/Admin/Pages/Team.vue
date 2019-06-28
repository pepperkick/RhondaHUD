<template>
    <div class='admin-page flex mb-4' id='team-page'>
        <div class='team w-1/2 h-12' id='team-blue'>
            <div class='title'>
                <span>Team Blue</span>
            </div>
            <div class="field">
                <label class="input-label">Team Name</label>
                <input class="input" type="text" v-model="team.blu.name" />
            </div>
        </div>
        <div class='team w-1/2 h-12' id='team-red'>
            <div class='title'>
                <span>Team Red</span>
            </div>
            <div class="field">
                <label class="input-label">Team Name</label>
                <input class="input" type="text" v-model="team.red.name" />
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
            }
        }
    },

    async created () {
        const active_red = await this.$axios.get('/config/active_teamred')
        const active_blu = await this.$axios.get('/config/active_teamblu')

        const teamred = await this.$axios.get(`/team/${active_red.data}`)
        const teamblu = await this.$axios.get(`/team/${active_blu.data}`)

        this.team.red = teamred.data
        this.team.blu = teamblu.data

        console.log(this.team)
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
}
</style>
