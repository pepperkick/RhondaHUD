<template>
    <div class='points-info'>
        <div id='points-container' v-if="round.gameType === '5CP'">
            <div class='point-info' v-for='i in 5' :class='getPointClasses(i - 1)' :key='i'>
                <span class='num-capping' v-if='isCapping(i - 1)'>x{{ getNumCapping(i - 1) }}</span>
                <div class='cap-progress' :class='getCaputreProgressClass(i - 1)' :style='getCaputreProgressStyle(i - 1)' v-if='getCappingTeam(i - 1) > 1'></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: [ 'round' ],
    methods: {
        getPointClasses(i) {
            return {
                'point-owned-none': this.round[`cap${i}`].cappedTeam == 0,
                'point-owned-blue': this.round[`cap${i}`].cappedTeam == 2,
                'point-owned-red': this.round[`cap${i}`].cappedTeam == 3,
                'point-locked': this.round[`cap${i}`].locked == 1,
                'point-unlocked': this.round[`cap${i}`].locked == 0,
                'point-blocked': this.round[`cap${i}`].locked == 1,
                'point-unblocked': this.round[`cap${i}`].locked == 0
            }
        },

        getCaputreProgressStyle (i) {
            let percentage = parseInt(parseFloat(this.round[`cap${i}`].percentage) * 100)
            percentage = percentage < 0 ? 0 : percentage > 100 ? 100 : percentage;

            console.log(percentage)

            return {
                'width': `${percentage}%`
            }
        },

        getCaputreProgressClass (i) {
            return {
                'cap-progress-red': this.getCappingTeam(i) == 2,
                'cap-progress-blue': this.getCappingTeam(i) == 3,
            }            
        },

        getNumCapping(i) {
            if (this.isCapping(i)) {
                return this.round[`cap${i}`].playersOnCap
            }
        },

        isCapping(i) {
            return this.round[`cap${i}`].cappingTeam != 0 && this.round[`cap${i}`].playersOnCap != 0
        },

        getCappingTeam(i) {
            return this.round[`cap${i}`].cappingTeam
        }
    }
}
</script>

<style lang='less'>
.points-info {
    position: fixed;
    height: @point-height;
    width: 480px;
    left: 0; right: 0;
    bottom: 16px;
    margin: auto;
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    text-align: center;

    #points-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;

        .point-info {
            position: relative;
            height: @point-height;
            width: @point-height;
            transition: 0.3s;
            display: flex;
            margin: auto;
            background: rgba(0, 0, 0, 0.5);

            .num-capping {
                position: absolute;
                color: #fff;
                font-size: 32px;
                font-weight: 900;
                top: 4px; left: 8px;
                z-index: 3;
            }
        }
    }

    .point-owned-none {
        border: @point-border-width solid @neutral-team-color;
    }

    .point-owned-blue {
        border: @point-border-width solid @red-team-color;
    }

    .point-owned-red {
        border: @point-border-width solid @blue-team-color;
    }

    .cap-progress {
        width: 0;
        height: 100%;
        z-index: 1;
    }

    .cap-progress-blue {
        margin: auto;
        margin-left: 0;
        background: rgba(red(@blue-team-color), green(@blue-team-color), blue(@blue-team-color), 0.8);
    }

    .cap-progress-red {
        margin: auto;
        margin-right: 0;
        background: rgba(red(@red-team-color), green(@red-team-color), blue(@red-team-color), 0.8);
    }
}
</style>
