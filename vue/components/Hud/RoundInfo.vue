<template>
    <div class='round-info'>
        <div class='match-info'>
            <div class="match-info-row-1">
                <div class="team-name team1-name">{{ $parent.config.teamblu_name || 'Team BLU' }}</div>
                <div class="team-score team1-score">
                    <span class="team-score-text">{{ teams.team_blue.score }}</span>
                </div>
                <div class="timer-container timer-container-5cp" v-if="round.gameType == '5CP'">
                    <span class="timer-match">{{ getFormattedTime(round.matchTimeLeft) }}</span>      
                    <span class="timer-round">{{ getFormattedTime(round.roundTimeLeft) }}</span>                    
                </div>
                <div class="timer-container timer-container-koth" v-if="round.gameType == 'KOTH'">
                    <div class="team-timer team1-timer">
                        <span>{{ getFormattedTime(round.blueTimeLeft) }}</span>
                    </div>      
                    <div class="team-timer team2-timer">
                        <span>{{ getFormattedTime(round.redTimeLeft) }}</span>
                    </div>                    
                </div>
                <div class="team-score team2-score">
                    <span class="team-score-text">{{ teams.team_red.score }}</span>
                    </div>
                <div class="team-name team2-name">{{ $parent.config.teamred_name || 'Team RED' }}</div>
            </div>
            <div class="match-info-row-2">
                <div class="series-score series-team1-score"></div>
                <div class="series-score series-team2-score"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: [ 'round', 'teams' ],
    methods: {
        getFormattedTime(time) {
            let mins = String(Math.floor(time / 60))
            let secs = String(Math.floor(time % 60))

            if (mins < 0) mins = "0"
            if (secs < 0) secs = "0"

            while (mins.length < 2) { mins = `0${mins}` }
            while (secs.length < 2) { secs = `0${secs}` }

            return `${mins}:${secs}`
        } 
    }
}
</script>

<style lang='less'>
.round-info {
    position: fixed;
    height: 144px;
    width: 1280px;
    left: 0; right: 0;
    top: 32px;
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
            
            .team-timer {
                width: 50%;
                color: white;
                font-size: 28px;
                font-weight: 900;
                text-transform: uppercase;
                text-shadow: 0 3px 5px #00000099;
                display: flex;

                span {
                    margin: auto;
                }
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
    }
}
</style>
