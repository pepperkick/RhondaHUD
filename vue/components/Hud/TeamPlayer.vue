<template>
    <div class="player-info">
        <div class="player-main-info">
            <div class="player-bar"></div>
            <div class="player-health-bar" :class="{ 'align-right': player.team == 2, 'align-left': player.team == 3, 'player-main-info-blue': player.team == 3, 'player-main-info-red': player.team == 2 }" :style="{ width: getBarWidth() }"></div>
            <div class="player-healthover-bar" :class="{ 'align-right': player.team == 2, 'align-left': player.team == 3 }" :style="{ width: getOverhealBarWidth() }"></div>
            <span class="player-health">{{ player.alive == 1 ? player.health : `${parseInt(player.respawnTime > 0 ? (player.respawnTime + 1): 1)}s` }}</span>
            <span class="player-name">{{ player.name }}</span>
            <span class="player-class">{{ getClass() }}</span>
        </div>
        <div class="player-sub-info" :class="{ 'align-right': player.team == 2, 'align-left': player.team == 3 }">
            <span class="player-score">Score: {{ player.score }}</span>
            <span class="player-kills">KDR: {{ player.kills / player.deaths == 0 ? 1 : player.deaths }}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: ["player"],
    methods: {
        getClass () {
            const player = this.player;

            if (player.class == 1) return "Scout";
            else if (player.class == 2) return "Sniper";
            else if (player.class == 3) return "Soldier";
            else if (player.class == 4) return "Demoman";
            else if (player.class == 5) return "Medic";
            else if (player.class == 6) return "Heavy";
            else if (player.class == 7) return "Pyro";
            else if (player.class == 8) return "Spy";
            else if (player.class == 9) return "Engineer";
            else return "Unknown"
        },
        
        getBarWidth() {
            if (this.player.alive == 1) {
                let width = (this.player.health / this.player.maxHealth) * 100;

                if (width > 100) width = 100;

                return `${parseInt(width)}%`;
            }

            return "0%"
        },
        
        getOverhealBarWidth() {
            if (this.player.alive == 1) {
                let width = (this.player.health / this.player.maxHealth) * 100;

                if (width > 100) width -= 100;  
                else return "0%"

                return `${parseInt(width)}%`;
            }

            return "0%"
        }
    }
}
</script>

<style lang="less">
.player-info {
    display: flex;
    flex-direction: column;
    height: 96px;
    width: 480px;
    margin: auto;
    margin-bottom: 16px;
    position: relative;
    
    .player-main-info {
        height: 48px;
        width: 100%;
        display: flex;
        color: white;
        position: relative;

        .player-bar {
            background: rgba(0, 0, 0, 0.5);
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0; left: 0;
            z-index: -2;
        }

        .align-right {
            left: unset !important;
            right: 0 ;
        }

        .player-health-bar {
            height: 100%;
            position: absolute;
            top: 0; left: 0;
            z-index: -1;
            transition: 0.3s;
        }

        .player-healthover-bar {
            height: 100%;
            position: absolute;
            top: 0; left: 0;
            z-index: -1;
            background: rgba(255, 255, 255, 0.33);
            transition: 0.3s;
        }

        .player-main-info-red {
            background: @red-team-color;
        }

        .player-main-info-blue {
            background: @blue-team-color;
        }

        .player-health {
            margin-top: auto;
            margin-bottom: auto;    
            margin-left: 16px;
            width: 24px;
        }

        .player-name {
            margin: auto auto auto 16px;
            font-size: 20px;
        }

        .player-class {
            color: white;
            margin: auto 16px auto auto;
            font-size: 16px;
        }
    }

    .align-right {
        .player-score {
            margin-left: auto !important;
        }    
    }

    .player-sub-info {
        height: 48px;
        width: 100%;
        display: flex;
        color: white;
        background: rgba(0, 0, 0, 0.5);

        .player-kills {
            margin-top: auto;
            margin-bottom: auto;    
            margin-left: 16px;
            margin-right: 16px;
        }

        .player-score {
            margin-top: auto;
            margin-bottom: auto;
            margin-left: 16px;
        }
    }
}
</style>
