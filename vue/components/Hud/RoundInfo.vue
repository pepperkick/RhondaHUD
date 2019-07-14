<template>
    <div class='round-info'>
        <div class='match-info'>
            <div class="match-info-row-1">
                <div class="team-name team1-name">{{ $parent.config.teamblu_name || 'Team BLU' }}</div>
                <div class="team-score team1-score">
                    <span class="team-score-text">{{ teams.team_blue.score }}</span>
                </div>
                <div class="timer-container timer-container-5cp" v-if="round.gameType == '5CP'">
                    <span class="timer-match">{{ getFormattedTime(round.matchTimeLeft - parseInt(matchTimeLeftOffset)) }}</span>      
                    <span class="timer-round">{{ getFormattedTime(round.roundTimeLeft) }}</span>                    
                </div>
                <div class="timer-container timer-container-koth" v-if="round.gameType == 'KOTH'">
                    <div class="team-timer team1-timer" :class="{ 'koth-timer-active': round.cap0.cappedTeam == 3 }">
                        <span>{{ getFormattedTime(round.blueTimeLeft) }}</span>
                    </div>      
                    <div class="team-timer team2-timer" :class="{ 'koth-timer-active': round.cap0.cappedTeam == 2 }">
                        <span>{{ getFormattedTime(round.redTimeLeft) }}</span>
                    </div>                    
                </div>
                <div class="team-score team2-score">
                    <span class="team-score-text">{{ teams.team_red.score }}</span>
                    </div>
                <div class="team-name team2-name">{{ $parent.config.teamred_name || 'Team RED' }}</div>
            </div>
            <div class="match-info-row-2" v-if="announcements.length > 0">
                <transition name="fade" mode="out-in" tag="div">
                    <div class="annoucement annoucement-seriesscore" :key='announcementsIndex' v-if="announcements[announcementsIndex].type == 'SeriesScore'">
                        <div class='series-team1-container'>
                            <div class="series-score series-team1-score" :class="{ 'series-team1-score-filled': seriesTeamBluWins >= 1 }"></div>
                            <div class="series-score series-team1-score" :class="{ 'series-team1-score-filled': seriesTeamBluWins >= 2 }" v-if='seriesBestOf >= 3'></div>
                            <div class="series-score series-team1-score" :class="{ 'series-team1-score-filled': seriesTeamBluWins >= 3 }" v-if='seriesBestOf >= 5'></div>
                            <div class="series-score series-team1-score" :class="{ 'series-team1-score-filled': seriesTeamBluWins >= 4 }" v-if='seriesBestOf >= 7'></div>
                        </div>
                        <span>Best of {{ seriesBestOf }}</span>
                        <div class='series-team2-container'>
                            <div class="series-score series-team2-score" :class="{ 'series-team2-score-filled': seriesTeamRedWins >= 4 }" v-if='seriesBestOf >= 7'></div>
                            <div class="series-score series-team2-score" :class="{ 'series-team2-score-filled': seriesTeamRedWins >= 3 }" v-if='seriesBestOf >= 5'></div>
                            <div class="series-score series-team2-score" :class="{ 'series-team2-score-filled': seriesTeamRedWins >= 2 }" v-if='seriesBestOf >= 3'></div>
                            <div class="series-score series-team2-score" :class="{ 'series-team2-score-filled': seriesTeamRedWins >= 1 }"></div>
                        </div>
                    </div>
                    <div class="annoucement" :key='announcementsIndex' v-if="announcements[announcementsIndex].type == 'Text'">
                        <span>{{ announcements[announcementsIndex].message }}</span>
                    </div>
                    <div class="annoucement" :key='announcementsIndex' v-if="announcements[announcementsIndex].type == 'Html'">
                        <div v-html='announcements[announcementsIndex].message'></div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: [ 'round', 'teams' ],
    data () {
        return {
            announcements: [],
            announcementsIndex: 0,
            announcementsDelay: 60,
            announcementsInterval: '',
            seriesBestOf: 3,
            seriesTeamBluWins: 0,
            seriesTeamRedWins: 0,
            matchTimeLeftOffset: 0
        }
    },

    methods: {
        getFormattedTime(time) {
            let mins = String(Math.floor(time / 60))
            let secs = String(Math.floor(time % 60))

            if (mins < 0) mins = "0"
            if (secs < 0) secs = "0"

            while (mins.length < 2) { mins = `0${mins}` }
            while (secs.length < 2) { secs = `0${secs}` }

            return `${mins}:${secs}`
        },

        update () {
            this.announcements = this.$parent.config.announcements || []
            this.announcementsDelay = this.$parent.config.announcementsDelay
            this.seriesBestOf = this.$parent.config.seriesBestOf
            this.seriesTeamBluWins = this.$parent.config.seriesWinsTeamBlu
            this.seriesTeamRedWins = this.$parent.config.seriesWinsTeamRed
            this.matchTimeLeftOffset = parseInt(this.$parent.config.matchTimeLeftOffset || 0)

            if (this.announcementsInterval) clearInterval(this.announcementsInterval)

            const delay = this.announcementsDelay > 0 ? this.announcementsDelay : 30

            this.announcementsInterval = setInterval(() => {
                if (this.announcementsIndex >= this.announcements.length - 1) {
                    this.announcementsIndex = 0
                } else {
                    this.announcementsIndex++
                }
            }, delay * 1000)
        }
    },

    sockets: {
        config (data) {
            this.update()
        }
    },

    created () {
        this.update()
    }
}
</script>

<style lang='less'>
.round-info {
    position: fixed;
    height: 144px;
    width: 1280px;
    left: 0; right: 0;
    top: 2px;
    margin: auto;
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    text-align: center;

    .match-info-row-1 {
        width: 100%;
        height: 80px;
        display: flex;
        flex-direction: row;
        background: rgba(0, 0, 0, 0.5);

        .team-name {
            font-size: 44px;
            font-weight: 900;
            color: white;
            text-transform: uppercase;
            width: 480px;
            margin-top: auto;
            margin-bottom: auto;
            text-shadow: 0 3px 5px #00000099;
        }

        .team-score {
            width: 80px;
            height: 100%;
            color: white;
            font-size: 44px;
            font-weight: 900;
            text-transform: uppercase;
            margin: auto;
            display: flex;
            text-shadow: 0 3px 5px #00000099;
    
            .team-score-text {
                margin: auto;
            }
        }

        .timer-container {
            height: 100%;
            width: 192px;
            display: flex;
        }

        .timer-container-5cp {
            background: linear-gradient(30deg, #aaa 0%, #ffffff 100%);
            flex-direction: column;
            color: #000;
            text-shadow: 0 3px 5px #00000033;

            .timer-match {
                margin-top: 8px;
                font-size: 40px;
                line-height: 40px;
                font-weight: 900;
            }

            .timer-round {
                font-size: 24px;
                line-height: 24px;
                font-weight: 600;
            } 
        }

        .timer-container-koth {
            display: flex;
            flex-direction: row;
            background: rgba(0, 0, 0, 0.5);
            
            .team-timer {
                width: 50%;
                color: white;
                font-size: 28px;
                font-weight: 900;
                text-transform: uppercase;
                text-shadow: 0 3px 5px #00000099;
                display: flex;
                transition: 0.3s;
                opacity: 0.75;

                span {
                    margin: auto;
                }
            }

            .koth-timer-active {
                opacity: 1;
            }

            .team1-timer {
                background: linear-gradient(30deg, @blue-team-color-dark 0%, @blue-team-color 100%);
            }

            .team2-timer {
                background: linear-gradient(300deg, @red-team-color-dark 0%, @red-team-color 100%);
            }
        }

        .team1-name {
            color: @blue-team-color;
        }

        .team2-name {
            color: @red-team-color;
        }

        .team1-score {
            background: linear-gradient(30deg, @blue-team-color-dark 0%, @blue-team-color 100%);
        }

        .team2-score {
            background: linear-gradient(300deg, @red-team-color-dark 0%, @red-team-color 100%);
        }
    }

    .match-info-row-2 {
        height: 32px;
        width: 356px;
        background: rgba(0, 0, 0, 0.5);
        margin-left: auto; 
        margin-right: auto;
        display: flex;

        .annoucement {
            color: white;
            font-size: 16px;
            text-transform: uppercase;
            margin: auto;
            transition: 0.3s;
        }

        .annoucement-seriesscore {
            display: flex;
            flex-direction: row;
            font-weight: 700;   
            width: 100%;

            .series-score {
                height: 16px;
                width: 16px;
                margin: 2px;
                border-radius: 50%;
            }

            .series-team1-container {
                margin: auto;
                margin-left: 16px;
                display: flex;
                flex-direction: row;
            }

            .series-team2-container {
                margin: auto;
                margin-right: 16px;
                display: flex;
                flex-direction: row;
            }

            .series-team1-score {
                border: 3px solid @blue-team-color;
            }

            .series-team1-score-filled {
                background: @blue-team-color;
            }

            .series-team2-score {
                border: 3px solid @red-team-color;
            }

            .series-team2-score-filled {
                background: @red-team-color;
            }
        }
    }
}

.fade-enter-active .fade-leave-active {
    transition: all 1s ease;
}
.fade-enter, .fade-leave-to
/* .slide-fade-leave-active for <2.1.8 */ {
    opacity: 0;
}
</style>
