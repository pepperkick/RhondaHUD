<template>
    <div class='admin-page' id='player-page'>
        <div class='team w-full h-12'>
            <div class='title'>
                <span>Player Information</span>
                <div class='actionbar'>
                    <span @click='openEditDialog(-1)'><i class='fas fa-plus'></i></span>
                </div>
            </div>
        </div>
        <div class='player w-full h-full'>
            <div class='player-item' v-for='(val, i) in $parent.players' :key='i'>
                <div class="list-item">
                    <div class="text-container">
                        <div class="title">
                            <span>{{ i }}</span>
                        </div>
                        <div class="subtitle">
                            <span>{{ val.name }}</span>
                        </div>
                    </div>
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
                    <span v-if='index === -1'>Add Player</span>
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
            index: -1,
            steamid: '',
            name: ''
        }
    },

    methods: {
        update () {
            this.$socket.emit('get-players');
        },
        
        async openEditDialog (index) {
            this.update();

            this.index = index;

            if (index !== -1) {
                this.steamid = index;
                this.name = this.$parent.players[index].name
            }

            this.editDialog = true
        },

        closeEditDialog () {
            this.editDialog = false
        },

        async submitData () {
            this.$socket.emit('set-player', this.steamid, {
                name: this.name
            });

            this.editDialog = false;

            this.update()
        },

        validateData () {
            return this.steamid !== '' && this.name !== '';
        },

        async deleteMessage (i) {
            this.$socket.emit('remove-player', i);
            this.update()
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
