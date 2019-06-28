<template>
    <div class='admin-page flex mb-4' id='team-page'>
        <div class='team w-1/2 h-12' id='team-blue'>
            <div class="field">
                <label class="input-label">Team Name</label>
                <input class="input" type="text" v-model="team.blue.name" />
            </div>
        </div>
        <div class='team w-1/2 h-12' id='team-red'>
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
                blue: {
                    name: '',
                    logo: ''
                },
                red: {
                    name: '',
                    logo: ''
                }
            }
        }
    }
}
</script>

<style lang="less">
</style>
