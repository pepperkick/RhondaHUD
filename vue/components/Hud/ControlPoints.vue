<template>
    <div class='points-info'>
        <div id='points-container' v-if="round.gameType === '5CP'">
            <div class='point-info' v-for='i in 5' :class='getPointClasses(i - 1)' :key='i'>
                <span class='num-capping' v-if='isCapping(i - 1)'>x{{ getNumCapping(i - 1) }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: [ 'round' ],
    methods: {
        getPointClasses(i) {
            const lazyperc = this.round.cap2.percentage
            const teamtime = this.round.cap2.teamTime
            const caplength = teamtime
            const capleft = lazyperc * teamtime
            const eltime = caplength - capleft

            // console.log(lazyperc, teamtime, caplength, capleft, eltime)

            if (caplength <= 0) console.log(0)
            else if (eltime > caplength) console.log(1)
            else console.log(eltime / caplength)

            return {
                'point-owned-none': this.round[`cap${i}`].cappedTeam == 0,
                'point-owned-blue': this.round[`cap${i}`].cappedTeam == 2,
                'point-owned-red': this.round[`cap${i}`].cappedTeam == 3,
                'point-capping-none': this.round[`cap${i}`].cappingTeam == 0,
                'point-capping-blue': this.round[`cap${i}`].cappingTeam == 3,
                'point-capping-red': this.round[`cap${i}`].cappingTeam == 2,
                'point-locked': this.round[`cap${i}`].locked == 1,
                'point-unlocked': this.round[`cap${i}`].locked == 0,
                'point-blocked': this.round[`cap${i}`].locked == 1,
                'point-unblocked': this.round[`cap${i}`].locked == 0
            }
        },

        getNumCapping(i) {
            if (this.isCapping(i)) {
                return this.round[`cap${i}`].playersOnCap
            }
        },

        isCapping(i) {
            return this.round[`cap${i}`].cappingTeam != 0 && this.round[`cap${i}`].playersOnCap != 0
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
            height: @point-height;
            width: @point-height;
            transition: 0.3s;
            display: flex;
            margin: auto;

            .num-capping {
                color: #fff;
                font-size: 32px;
                font-weight: 900;
                margin: auto;
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

    .point-capping-none {
        background: rgba(0, 0, 0, 0.5);
    }

    .point-capping-blue {
        background: rgba(red(@blue-team-color), green(@blue-team-color), blue(@blue-team-color), 0.5);
    }

    .point-capping-red {
        background: rgba(red(@red-team-color), green(@red-team-color), blue(@red-team-color), 0.5);
    }
}
</style>
