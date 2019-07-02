<template>
    <div class='points-info'>
        <div id='points-container' v-if="round.gameType === '5CP'">
            <div class='point-info' v-for='i in 5' :key='i'>
                <div class='point-ring-container'>
                    <div class="point-status-icon">
                        <img :src="getPointStatus(i - 1)"/>
                    </div>
                    <div class='progress-point-ring' v-if='showPointRing[i - 1]'>
                        <vue-circle
                            class='point-progress-ring__circle'
                            :progress="getCaputreProgress(i - 1)"
                            :size="66"
                            :ref="`pointProgress${i - 1}`"
                            :reverse="false"
                            line-cap="round"
                            :fill="getPointProgressColor(i - 1)"
                            empty-fill="rgba(0, 0, 0, 0)"
                            :animation="false"
                            :animation-start-value="0.0"
                            :start-angle="-1.57"
                            insert-mode="append"
                            :thickness="8"
                            :show-percent="false">
                        </vue-circle>
                    </div>
                    <svg class="point-ring" height="90" width="90" >
                        <circle class="point-ring__circle" :stroke="getPointColor(i - 1)" stroke-width="8" fill="rgba(0, 0, 0, 0.5)" r="29" cx="45" cy="45" />
                    </svg>
                </div>
            </div>
        </div>
        <div id='points-container' v-else-if="round.gameType === 'KOTH'">
            <div class='point-info'>
                <div class='point-ring-container'>
                    <div class="point-status-icon">
                        <img :src="getPointStatus(0)"/>
                    </div>
                    <div class='progress-point-ring' v-if='showPointRing[0]'>
                        <vue-circle
                            class='point-progress-ring__circle'
                            :progress="getCaputreProgress(0)"
                            :size="66"
                            :ref="`pointProgress${0}`"
                            :reverse="false"
                            line-cap="round"
                            :fill="getPointProgressColor(0)"
                            empty-fill="rgba(0, 0, 0, 0)"
                            :animation="false"
                            :animation-start-value="0.0"
                            :start-angle="-1.57"
                            insert-mode="append"
                            :thickness="8"
                            :show-percent="false">
                        </vue-circle>
                    </div>
                    <svg class="point-ring" height="90" width="90" >
                        <circle class="point-ring__circle" :stroke="getPointColor(i - 1)" stroke-width="8" fill="rgba(0, 0, 0, 0.5)" r="29" cx="45" cy="45" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import VueCircle from 'vue2-circle-progress/src/index.vue'

export default {
    props: [ 'round' ],
    components: {
        VueCircle
    },
    data () {
        return {
            pointProgress: [],
            showPointRing: []
        }
    },
    methods: {
        getPointColor (i) {
            if (this.round[`cap${i}`].cappedTeam == 0) return `#ffffff`
            if (this.round[`cap${i}`].cappedTeam == 3) return `#00a9e4`
            if (this.round[`cap${i}`].cappedTeam == 2) return `#ff4136`
        },

        getPointProgressColor (i) {
            if (this.round[`cap${i}`].cappingTeam == 3) return { color: "#00a9e4" }
            if (this.round[`cap${i}`].cappingTeam == 2) return { color: "#ff4136" }

            return { color: 'rgba(0, 0, 0, 0)' }
        },

        setPointProgress (i, percent) {
            const circumference = 182.12
            const offset = circumference - percent / 100 * circumference
            this.$refs[`pointProgressBar${i}`][0].style.strokeDashoffset = offset

            console.log(i, percent, offset)
        },

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

        getCaputreProgress (i) {
            let percentage = parseInt(parseFloat(this.round[`cap${i}`].percentage) * 100)
            percentage = percentage < 0 ? 0 : percentage > 100 ? 100 : percentage
            
            return percentage
        },

        getCaputreProgressStyle (i) {
            const percentage = this.getCaputreProgress(i)
            
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
        },

        isPointLocked(i) {
            const point0 = this.round.cap0
            const point1 = this.round.cap1
            const point2 = this.round.cap2
            const point3 = this.round.cap3
            const point4 = this.round.cap4

            if (i == 0) {
                if (point0.cappedTeam == 3 && point1.cappedTeam == 3) {
                    return true
                }
            } else if (i == 1) {
                if (point1.cappedTeam == 3 && point2.cappedTeam == 3) {
                    return true
                } else if (point2.cappedTeam == 0) {
                    return true
                } else if (point0.cappedTeam == 2) {
                    return true
                }
            } else if (i == 2) {
                if (point2.cappedTeam == 3 && point3.cappedTeam == 3) {
                    return true
                } else if (point2.cappedTeam == 2 && point1.cappedTeam == 2) {
                    return true
                }
            } else if (i == 3) {
                if (point3.cappedTeam == 2 && point2.cappedTeam == 2) {
                    return true
                } else if (point2.cappedTeam == 0) {
                    return true
                } else if (point4.cappedTeam == 3) {
                    return true
                }
            } else if (i == 4) {
                if (point4.cappedTeam == 2 && point3.cappedTeam == 2) {
                    return true
                }
            } 

            return false
        },

        getPointStatus(i) {
            const point = this.round[`cap${i}`]

            if (this.round.gameType == '5CP') {
                if (this.isPointLocked(i) == 1) {
                    return this.$parent.controlPointIcons.locked
                } else if (point.playersOnCap == 1) {
                    return this.$parent.controlPointIcons.oneOnPoint
                } else if (point.playersOnCap == 2) {
                    return this.$parent.controlPointIcons.twoOnPoint
                } else if (point.playersOnCap >= 3) {
                    return this.$parent.controlPointIcons.threeOnPoint
                }
            }
        }
    },

    updated () { 
        if (this.round.gameType == '5CP') {
            for (let i = 0; i < 5; i++) {
                const perc = this.getCaputreProgress(i)

                if (perc == 0) {
                    this.showPointRing[i] = false;
                } else {                
                    this.showPointRing[i] = true;
                    this.$refs[`pointProgress${i}`][0].updateProgress(perc);
                }
            }
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

            .point-ring-container {
                position: absolute;
                top: -12px; left: -12px;
                
                .point-ring {
                    position: absolute;
                    top: 0; left: 0;
                    z-index: 1;
                }

                .point-status-icon {
                    position: absolute;
                    filter: brightness(0) invert(1);
                    z-index: 5;
                    
                    img {
                        margin-top: 30px;
                        margin-left: 32px;
                        height: 28px;
                        z-index: 5;
                    }
                }

                .point-progress-ring__circle {
                    position: absolute;
                    top: 12px; left: 12px;
                    z-index: 3;
                }
            }

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
