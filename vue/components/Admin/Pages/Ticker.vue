<template>
    <div class='admin-page' id='ticker-page'>
        <div class='title'>
            <span>Ticker Messages</span>
            <div class='actionbar'>
                <span @click='openEditDialog(-1)'><i class='fas fa-plus'></i></span>
            </div>
        </div>
        <div class='flex mb-4' >
            <div class='ticker w-full h-full' id='ticker-edit-form'>
                <div class='ticker-message' v-for='(val, i) in annoucements' :key='i'>
                    <div class='subtitle'>
                        <span>{{ val.type }}</span>
                        <div class='actionbar'>
                            <span @click='deleteMessage(i)'><i class='fas fa-trash'></i></span>
                            <span @click='moveUp(i)'><i class='fas fa-arrow-up'></i></span>
                            <span @click='moveDown(i)'><i class='fas fa-arrow-down'></i></span>
                            <span @click='openEditDialog(i)'><i class='fas fa-edit'></i></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>    
        <div class='ticker-edit-dialog-container' v-if='editDialog'>
            <div class='ticker-edit-dialog'>
                <div class='title'>
                    <span v-if='index == -1'>Add Ticker</span>
                    <span v-else>Edit Ticker</span>
                    <div class='actionbar'>
                        <span @click='closeEditDialog'><i class='fas fa-times'></i></span>
                    </div>
                </div>
                <div class="flex flex-col mb-4 relative h-full">
                    <div class='subtitle'>
                        <span>Ticker Type</span>
                    </div>
                    <div class="types">
                        <label v-for="(val, index) in types" :key='index' class="type-radio-button">
                            <input type="radio" :value="index" name="type" v-model="selectedType">
                            <span>{{ val }}</span>
                        </label>
                    </div>
                    <div class="field" v-if="requriedMessage()">
                        <label class="input-label">Message</label>
                        <input class="input" type="text" v-model="message" />
                    </div>
                    <div class='submit-dialog-fab' @click="submitData" v-if="validateData()">
                        <i class="fas fa-check"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class='title'>
            <span>Settings</span>
        </div>
        <div class="field">
            <label class="input-label">Delay (in seconds)</label>
            <input class="input" type="number" v-model="delay" />
        </div>
    </div>
</template>

<script>
function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
};

export default {
    data () {
        return {
            editDialog: false,
            annoucements: [],
            types: [ 'SeriesScore', 'Text', 'Html' ],
            selectedType: -1,
            index: -1,
            message: '',
            delay: 30
        }
    },

    methods: { 
        async update () {
            try {
                const annoucements = await this.$axios.get('/config/annoucements')
                const annoucementsDelay = await this.$axios.get('/config/annoucementsDelay')

                if (annoucements.data.length > 0)
                    this.annoucements = annoucements.data

                this.delay = annoucementsDelay.data || 30
            } catch (error) {
                console.log(error)
            }
        },

        async openEditDialog (index) {
            await this.update()

            this.index = index

            if (index != -1) {
                for (let i in this.types) {
                    if (this.types[i] == this.annoucements[index].type) {
                        this.selectedType = i
                    }
                }

                this.message = this.annoucements[index].message
            }

            this.editDialog = true
        },

        closeEditDialog () {
            this.editDialog = false
        },

        async submitData () {
            const type = this.types[this.selectedType]
            
            if (this.selectedType == -1) return

            if (this.selectedType > 0 && this.message == '') return

            if (this.index == -1) {
                if ([ 1, 2 ].includes(this.selectedType))
                    this.annoucements.push({ type, message: this.message })
                else
                    this.annoucements.push({ type })  
            } else {
                if ([ 1, 2 ].includes(this.selectedType))
                    this.annoucements[this.index] = { type, message: this.message }
                else
                    this.annoucements[this.index] = { type}
            }

            await this.saveData()

            this.editDialog = false
        },

        async saveData () {
            await this.$axios.post('/config', {
                key: 'annoucements',
                value: this.annoucements
            })

            await this.update()
        },

        validateData () {
            if (this.selectedType > -1) {
                if (this.selectedType == 0)
                    return true
                else if ([ 1, 2 ].includes(this.selectedType))
                    if (this.message !== '')
                        return true
            }

            return false
        },

        requriedMessage () {
            if (this.selectedType > -1) {
                if ([ 1, 2 ].includes(this.selectedType))
                    return true
            }

            return false
        },

        async deleteMessage (i) {
            this.annoucements = this.annoucements.splice(i, 1)

            await this.saveData()
        },

        async moveUp (i) {
            if (i == 0) return
            this.annoucements = array_move(this.annoucements, i, i - 1)

            await this.saveData()
        },

        async moveDown (i) {
            if (i >= this.annoucements.length - 1) return
            this.annoucements = array_move(this.annoucements, i, i + 1)

            await this.saveData()
        }
    },

    async created () {
        this.update()
    },

    watch: {
        delay: {
            deep: true,
            async handler () {
                await this.$axios.post('/config', {
                    key: 'annoucementsDelay',
                    value: this.delay
                })

                await this.update()
            }
        }
    }
}
</script>

<style lang="less">
.ticker-message {
    color: white;
    text-transform: uppercase;
    margin-bottom: 16px;
}

.ticker-edit-dialog-container {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0; left: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;

    .ticker-edit-dialog {
        width: 720px;
        height: 640px;
        background: @secondary-color;
        margin: auto;
        padding-top: 32px;
    }
}

.types {
    margin-top: 4px;
    margin-bottom: 16px;

    .type-radio-button {
        color: white;
        margin-left: 32px;

        span {
            margin-left: 4px;
            text-transform: uppercase;
        }
    }
}
</style>
