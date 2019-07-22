<template>
    <div class='admin-page' id='player-page'>
        <div class='team w-full h-12' id='player-edit-form'>
            <div class='title'>
                <span>Player Information</span>
                <div class='actionbar'>
                    <span @click='openEditDialog(-1)'><i class='fas fa-plus'></i></span>
                </div>
            </div>
        </div>
        <div class='player w-full h-full' id='player-edit-form'>
            <div class='player-item' v-for='(val, i) in players' :key='i'>
                <div class='subtitle'>
                    <span>{{ val.steamid }} - {{ val.name }}</span>
                    <div class='actionbar'>
                        <span @click='deleteMessage(i)'><i class='fas fa-trash'></i></span>
                        <span @click='openEditDialog(i)'><i class='fas fa-edit'></i></span>
                    </div>
                </div>
            </div>
        </div>    
        <div class='player-edit-dialog-container' v-if='editDialog'>
            <div class='player-edit-dialog'>
                <div class='title'>
                    <span v-if='index == -1'>Add Player</span>
                    <span v-else>Edit Player</span>
                    <div class='actionbar'>
                        <span @click='closeEditDialog'><i class='fas fa-times'></i></span>
                    </div>
                </div>
                <div class="flex flex-col mb-4 relative h-full">
                    <div class="field">
                        <label class="input-label">Player SteamID</label>
                        <input class="input" type="text" v-model="steamid" />
                    </div>
                    <div class="field">
                        <label class="input-label">Player Name</label>
                        <input class="input" type="text" v-model="name" />
                    </div>
                    <div class='submit-dialog-fab' @click="submitData" v-if="validateData()">
                        <i class="fas fa-check"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>    
</template>

<script>
export default {
    data () {
        return {
            editDialog: false,
            players: [],
            index: -1,
            steamid: '',
            name: ''
        }
    },

    methods: {
        async update () {
            this.players = [];

            try {
                const players = await this.$axios.get('/player');

                this.players = players.data
            } catch (error) {
                console.log(error)
            }
        },
        
        async openEditDialog (index) {
            await this.update();

            this.index = index;

            if (index != -1) {
                this.steamid = this.players[index].steamid;
                this.name = this.players[index].name
            }

            this.editDialog = true
        },

        closeEditDialog () {
            this.editDialog = false
        },

        async submitData () {
            try {
                const steamid = this.steamid;
                const name = this.name;

                await this.$axios.post('/player', {
                    steamid, name
                })
            } catch (error) {
                console.log(error)
            }

            this.editDialog = false;

            await this.update()
        },

        validateData () {
            if (this.steamid != '' && this.name != '') return true;

            return false
        },

        async deleteMessage (i) {
            const id = this.players[i].steamid;
            await this.$axios.delete(`/player/${id}`);
            await this.update()
        },
    },

    async created () {
        this.update()
    }
}
</script>

<style lang="less">
.player-edit-dialog-container {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0; left: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;

    .player-edit-dialog {
        width: 720px;
        height: 640px;
        background: @secondary-color;
        margin: auto;
        padding-top: 32px;
    }
}
</style>
