<template>
    <div class='round-info'>
        <div class='match-info'>
            <div class="match-info-row-1">
                <div class="team-info-container team1-info">
                    <div class="team-name team1-name" ref="team1_name">{{ $parent.config.teamblu_name || 'Team BLU' }}</div>
                    <div class="team-score team1-score">
                        <span class="team-score-text">{{ teams.team_blue.score }}</span>
                    </div>
                    <div class="team-info-bg team1-bg" ref="team1_bg"></div>
                </div>
                <div class="timer-container">
                    <div class="timer timer-paused" v-if="round.isPaused">
                        <img id="timer-pause-icon" :src="$parent.timerIcon"/>
                        <span>MATCH PAUSED</span>
                    </div>
                    <div class="timer timer-golden-cap" v-if="$parent.config.goldenCapMode">
                        <span class="timer-round">{{ getFormattedTime(round.roundTimeLeft) }}</span>
                        <div class="timer-golden-cap-text">
                            <img id="timer-golden-cap-icon" :src="$parent.cupIcon"/>
                            <span>GOLDEN CAP</span>
                        </div>
                    </div>
                    <div class="timer timer-5cp" v-if="round.gameType === '5CP'">
                        <span class="timer-match">{{ getFormattedTime(round.matchTimeLeft - parseInt(matchTimeLeftOffset)) }}</span>
                        <div v-if="parseInt(round.matchTimeLeft) > 0">
                            <span class="timer-round">{{ getFormattedTime(round.roundTimeLeft) }}</span>
                        </div>
                        <div v-else>
                            <span class="timer-round">MAP ENDED</span>
                        </div>
                    </div>
                    <div class="timer timer-koth" v-if="round.gameType === 'KOTH'">
                        <div class="team-timer team1-timer" :class="{ 'koth-timer-active': parseInt(round.cap0.cappedTeam) === 3 }">
                            <span>{{ getFormattedTime(round.blueTimeLeft) }}</span>
                        </div>
                        <div class="team-timer team2-timer" :class="{ 'koth-timer-active': parseInt(round.cap0.cappedTeam) === 2 }">
                            <span>{{ getFormattedTime(round.redTimeLeft) }}</span>
                        </div>
                    </div>
                </div>
                <div class="team-info-container team2-info">
                    <div class="team-info-bg team2-bg" ref="team2_bg"></div>
                    <div class="team-score team2-score">
                        <span class="team-score-text">{{ teams.team_red.score }}</span>
                    </div>
                    <div class="team-name team2-name" ref="team2_name">{{ $parent.config.teamred_name || 'Team RED' }}</div>
                </div>
            </div>
            <div class="match-info-row-2" v-if="announcements.length > 0">
                <transition name="fade" mode="out-in" tag="div">
                    <div class="announcement announcement-seriesscore" :key='announcementsIndex' v-if="announcements[announcementsIndex].type === 'SeriesScore'">
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
                    <div class="announcement" :key='announcementsIndex' v-if="announcements[announcementsIndex].type === 'Text'">
                        <span>{{ announcements[announcementsIndex].message }}</span>
                    </div>
                    <div class="announcement" :key='announcementsIndex' v-if="announcements[announcementsIndex].type === 'Html'">
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
            let mins = String(Math.floor(time / 60));
            let secs = String(Math.floor(time % 60));

            if (mins < 0) mins = "0";
            if (secs < 0) secs = "0";

            while (mins.length < 2) { mins = `0${mins}` }
            while (secs.length < 2) { secs = `0${secs}` }

            return `${mins}:${secs}`
        },

        eventTeamRoundWin (event) {
            if (parseInt(event.team) === 2) {
                this.$refs.team2_bg.classList.add('team-info-bg-full');
                this.$refs.team2_name.classList.remove('team2-name');
                setTimeout(() => {
                    this.$refs.team2_bg.classList.remove('team-info-bg-full');
                    this.$refs.team2_name.classList.add('team2-name');
                }, 5 * 1000);
            } else if (parseInt(event.team) === 3) {
                this.$refs.team1_bg.classList.add('team-info-bg-full');
                this.$refs.team1_name.classList.remove('team1-name');
                setTimeout(() => {
                    this.$refs.team1_bg.classList.remove('team-info-bg-full');
                    this.$refs.team1_name.classList.add('team1-name');
                }, 5 * 1000);
            }
        },

        update () {
            this.announcements = this.$parent.config.announcements || [];
            this.announcementsDelay = this.$parent.config.announcementsDelay;
            this.seriesBestOf = this.$parent.config.seriesBestOf;
            this.seriesTeamBluWins = this.$parent.config.seriesWinsTeamBlu;
            this.seriesTeamRedWins = this.$parent.config.seriesWinsTeamRed;
            this.matchTimeLeftOffset = parseInt(this.$parent.config.matchTimeLeftOffset || 0);

            if (this.announcementsInterval) clearInterval(this.announcementsInterval);

            const delay = this.announcementsDelay > 0 ? this.announcementsDelay : 30;

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
        config () {
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

        .team-info-container {
            height: 100%;
            display: flex;
            flex-direction: row;
            width: 546px;
            position: relative;

            .team-info-bg {
                position: absolute;
                height: 100%;
                width: 84px;
                transition: 0.3s ease-out;
                top: 0;
                z-index: 0;
            }

            .team-info-bg-full {
                width: 100%;
            }

            .team-name {
                font-size: 44px;
                font-weight: 900;
                color: white;
                text-transform: uppercase;
                width: 480px;
                margin-top: auto;
                margin-bottom: auto;
                text-shadow: 0 3px 5px #00000099;
                z-index: 3;
                transition: 0.3s;
            }

            .team-score {
                width: 88px;
                height: 100%;
                color: white;
                font-size: 44px;
                font-weight: 900;
                text-transform: uppercase;
                margin: auto;
                display: flex;
                text-shadow: 0 3px 5px #00000099;
                z-index: 3;

                .team-score-text {
                    margin: auto;
                }
            }

            .team1-name {
                color: @blue-team-color;
            }

            .team2-name {
                color: @red-team-color;
            }

            .team1-bg {
                background: linear-gradient(30deg, @blue-team-color-dark 0%, @blue-team-color 100%);
                right: 0;
            }

            .team2-bg {
                background: linear-gradient(300deg, @red-team-color-dark 0%, @red-team-color 100%);
                left: 0;
            }
        }

        .timer-container {
            position: relative;
        }


        .timer {
            height: 100%;
            min-width: 188px;
            position: relative;
        }

        .timer-paused {
            background: linear-gradient(30deg, #aaaaaaff 0%, #ffffffff 100%);
            flex-direction: column;
            color: #000;
            position: absolute;
            top: 0; left: 0;
            z-index: 3;
            display: flex;
            text-shadow: 0 3px 5px #00000033;

            #timer-pause-icon {
                height: 40px;
                margin: auto;
                margin-top: 8px;
            }

            span {
                font-size: 20px;
                line-height: 24px;
                font-weight: 600;
                margin-bottom: 8px;
            }
        }

        .timer-golden-cap {
            background: linear-gradient(30deg, #fffc00ee 0%, #fffc00ee 100%);
            flex-direction: column;
            color: #000;
            position: absolute;
            top: 0; left: 0;
            z-index: 2;
            display: flex;
            text-shadow: 0 3px 5px #00000033;

            .timer-round {
                margin-top: 8px;
                font-size: 40px;
                line-height: 40px;
                font-weight: 900;
            }

            .timer-golden-cap-text {
                display: flex;
                flex-direction: row;

                img {
                    height: 20px;
                    margin: auto;
                    margin-right: 2px;
                }

                span {
                    margin: auto;
                    margin-left: 2px;
                    font-size: 20px;
                    line-height: 24px;
                    font-weight: 600;
                }
            }
        }

        .timer-5cp {
            background: linear-gradient(30deg, #aaa 0%, #ffffff 100%);
            flex-direction: column;
            color: #000;
            text-shadow: 0 3px 5px #00000033;
            display: flex;
            z-index: 1;

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

        .timer-koth {
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
    }

    .match-info-row-2 {
        height: 32px;
        width: 356px;
        background: rgba(0, 0, 0, 0.5);
        margin-left: auto; 
        margin-right: auto;
        display: flex;

        .announcement {
            color: white;
            font-size: 16px;
            text-transform: uppercase;
            margin: auto;
            transition: 0.3s;
        }

        .announcement-seriesscore {
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
