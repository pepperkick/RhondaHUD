<template>
    <div class='round-info'>
        <div class='match-info' v-if="round.gameType === '5CP'">
            <div class='team-info-container' id='team-blue-info-container'>
                <span class='team-wins' id='wins'>{{ teams.team_blue.score }}</span>
            </div>
            <div class='timer-info'>
                <div id='match-timeleft-container'>
                    <span id='timeleft'>{{ getFormattedTime(round.matchTimeLeft) }}</span>
                </div>
                <div id='round-timeleft-container'>
                    <span id='timeleft'>{{ getFormattedTime(round.roundTimeLeft) }}</span>
                </div>
            </div>
            <div class='team-info-container' id='team-red-info-container'>
                <span class='team-wins' id='wins'>{{ teams.team_red.score }}</span>
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
    height: 96px;
    width: 720px;
    left: 0; right: 0;
    top: 32px;
    margin: auto;
    margin-top: 16px;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    text-align: center;

    .match-info {
        display: flex;
        flex-direction: row; 
        height: 100%;
    }
    
    .team-info-container {
        display: flex;
        flex-direction: column;
        width: 40%;

        .team-wins {
            color: #fff;
            font-size: 48px;
            font-weight: 900;
            margin-top: auto;
            margin-bottom: auto;
        }
    }

    #team-blue-info-container {
        border-right: 8px solid @blue-team-color;

        #wins {
            margin-left: auto;
            margin-right: 24px;
        }
    }

    #team-red-info-container {
        border-left: 8px solid @red-team-color;

        #wins {
            margin-left: 24px;
            margin-right: auto;
        }
    }

    .timer-info {
        width: 20%;

        #match-timeleft-container {
            margin-top: 12px;
            
            #timeleft {
                color: #fff;
                font-size: 36px;
                font-weight: 700;
            }    
        }
        
        #round-timeleft-container {
            #timeleft {
                color: #fff;
                opacity: 0.66;
                font-size: 24px;
                font-weight: 500;
            }
        }
    }
}
</style>
