<template>
    <div class="admin-page" id='series-page'>
        <div class='title'>
            <span>Series Information</span>
        </div>
        <div class='flex mb-4'>
            <div class='flex flex-col w-full h-12' id='series-extra'> 
                <div class='subtitle'>
                    <span>Series Best of</span>
                </div>
                <div class="series-bo">
                    <label class="bo-radio-button">
                        <input type="radio" value="3" name="type" v-model="selected">
                        <span>Best of 3</span>
                    </label>
                    <label class="bo-radio-button">
                        <input type="radio" value="5" name="type" v-model="selected">
                        <span>Best of 5</span>
                    </label>
                    <label class="bo-radio-button">
                        <input type="radio" value="7" name="type" v-model="selected">
                        <span>Best of 7</span>
                    </label>
                </div>
                <div class='subtitle'>
                    <span>Team BLU Wins</span>
                </div>
                <div class="series-bo">
                    <label class="bo-radio-button">
                        <input type="radio" value="0" name="wins1" v-model="wins1">
                        <span>0</span>
                    </label>
                    <label class="bo-radio-button">
                        <input type="radio" value="1" name="wins1" v-model="wins1">
                        <span>1</span>
                    </label>
                    <label class="bo-radio-button" v-if='selected >= 3'>
                        <input type="radio" value="2" name="wins1" v-model="wins1">
                        <span>2</span>
                    </label>
                    <label class="bo-radio-button" v-if='selected >= 5'>
                        <input type="radio" value="3" name="wins1" v-model="wins1">
                        <span>3</span>
                    </label>
                    <label class="bo-radio-button" v-if='selected >= 7'>
                        <input type="radio" value="4" name="wins1" v-model="wins1">
                        <span>4</span>
                    </label>
                </div>
                <div class='subtitle'>
                    <span>Team RED Wins</span>
                </div>
                <div class="series-bo">
                    <label class="bo-radio-button">
                        <input type="radio" value="0" name="wins2" v-model="wins2">
                        <span>0</span>
                    </label>
                    <label class="bo-radio-button">
                        <input type="radio" value="1" name="wins2" v-model="wins2">
                        <span>1</span>
                    </label>
                    <label class="bo-radio-button" v-if='selected >= 3'>
                        <input type="radio" value="2" name="wins2" v-model="wins2">
                        <span>2</span>
                    </label>
                    <label class="bo-radio-button" v-if='selected >= 5'>
                        <input type="radio" value="3" name="wins2" v-model="wins2">
                        <span>3</span>
                    </label>
                    <label class="bo-radio-button" v-if='selected >= 7'>
                        <input type="radio" value="4" name="wins2" v-model="wins2">
                        <span>4</span>
                    </label>
                </div>
                <div class="toggle">
                    <div class='subtitle'>
                        <span>Enable GoldenCap Mode</span>
                    </div>
                    <label class="switch">
                      <input type="checkbox" v-model="goldenCapMode">
                      <span class="slider round"></span>
                    </label>
                </div>
                <div class="field">
                    <label class="input-label">Match Time Left Offset</label>
                    <input class="input" type="number" v-model="timeLeftOffset" />
                </div>
            </div>
        </div>    
    </div>
</template>

<script>
export default {
    data () {
        return {
            selected: 5,
            wins1: 0,
            wins2: 0,
            timeLeftOffset: 0,
            goldenCapMode: false
        }
    },

    methods: {
        async update () {
            this.selected = this.$parent.config.seriesBestOf || 5;
            this.wins1 = this.$parent.config.seriesWinsTeamBlu || 0;
            this.wins2 = this.$parent.config.seriesWinsTeamRed || 0;
            this.timeLeftOffset = this.$parent.config.matchTimeLeftOffset || 0;
            this.goldenCapMode = this.$parent.config.goldenCapMode || false;
        }
    },

    watch: {
        selected: {
            deep: true,
            async handler () {
                this.$socket.emit('set-config', 'seriesBestOf', this.selected);
            }
        },

        wins1: {
            deep: true,
            async handler () {
                this.$socket.emit('set-config', 'seriesWinsTeamBlu', this.wins1);
            }
        },

        wins2: {
            deep: true,
            async handler () {
                this.$socket.emit('set-config', 'seriesWinsTeamRed', this.wins2);
            }
        },

        timeLeftOffset: {
            deep: true,
            async handler () {
                this.$socket.emit('set-config', 'matchTimeLeftOffset', this.timeLeftOffset);
            }
        },

        goldenCapMode: {
            deep: true,
            async handler () {
                this.$socket.emit('set-config', 'goldenCapMode', this.goldenCapMode);
            }
        }
    },

    async created () {
        this.update()
    }
}
</script>

<style lang="less">
.series-bo {
    margin-top: 4px;
    margin-bottom: 16px;

    .bo-radio-button {
        color: white;
        margin-left: 32px;

        span {
            margin-left: 4px;
            text-transform: uppercase;
        }
    }
}
</style>
