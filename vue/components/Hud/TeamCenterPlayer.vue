<template>
    <div class="player-center-info">
        <div class='player-center-health-info'>
            <div class='player-center-health-bar-container '>
                <div class='player-center-health-bar' :class='{ "team-red-color": player.team == 2, "team-blue-color": player.team == 3}' :style='{ width: getBarWidth() }'></div>
                <div class='player-center-health-bar-delay' :style='{ width: getBarWidth() }'></div>
            </div>
            <div class='player-center-healthover-bar' :class='{ "team-red-color": player.team == 2, "team-blue-color": player.team == 3}' :style='{ width: getOverhealBarWidth() }'></div>
        </div>
        <div class='player-center-main-info'>
            <div class='player-center-basic-info'>
                <div class='flex flex-colum info-row-1'>
                    <img class='player-center-class' :src='$parent.classIcons[player.class]' />        
                    <img :class='{ "player-center-disguise-class": getDisguiseClassIcon() }' :src='getDisguiseClassIcon()' />          
                    <div class='player-center-name'>
                        <span>{{ getName() }}</span>
                    </div>
                    <div class="player-center-health">   
                        <img class='center-health-effect-icon' :src='getHealthEffectIcon()' />
                        <span :class='getHealthClass()'>{{ player.alive == 1 ? player.health : parseInt(player.respawnTime) > 0 ? `${parseInt(player.respawnTime)}s` : `1s` }}</span> 
                    </div>     
                </div>
                <div class='info-row-2'>
                    <div class='player-center-stats' v-if="player.class == 5">
                        <span>D {{ player.deaths }}</span>
                        <span>H {{ player.healing }}</span>
                        <div class='player-center-ammo' v-if='player.alive'>
                            <img class='player-center-ammo-icon' :src='$parent.ammoIcon' />
                            <span class='player-center-ammo-value'>{{ getAmmo() }}</span>
                        </div>
                    </div>
                    <div class='player-center-stats' v-else>
                        <span>K {{ player.kills }}</span>
                        <span>D {{ player.deaths }}</span>
                        <span>DPM {{ player.dpm }}</span>
                        <div class='player-center-ammo' v-if='player.alive'>
                            <img class='player-center-ammo-icon' :src='$parent.ammoIcon' />
                            <span class='player-center-ammo-value'>{{ getAmmo() }}</span>
                        </div>
                    </div>
                </div>
            </div>      
        </div>
        <div class='player-center-bottom-bar' :class='{ "team-red-color": player.team == 2, "team-blue-color": player.team == 3}'></div>
    </div>
</template>

<script>
export default {
    props: ["player"],
    methods: {
        getName () {
            const player = this.player
            const cache = this.$parent.playerCache

            if (cache[player.steamid]) {
                return cache[player.steamid].name
            } else {
                return player.name
            }
        },

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

        getDisguiseClassIcon() {
            if (this.player.class == 8 && this.player.disguise.class > 0) {
                return this.$parent.classIcons[this.player.disguise.class]
            }

            return false
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
            const overheal = [ 0, 185, 185, 300, 260, 225, 450, 260, 185, 185 ]

            if (this.player.alive == 1 && parseInt(this.player.health) > parseInt(this.player.maxHealth)) {
                const maxoverheal = overheal[this.player.class]
                const overhealth = maxoverheal - parseInt(this.player.maxHealth)
                const curoverhealth = parseInt(this.player.health) - parseInt(this.player.maxHealth)

                let width = (curoverhealth / overhealth) * 100

                if (width > 100) width = 100

                return `${parseInt(width)}%`
            }

            return "0%"
        },

        getHealthEffectIcon () {
            if (this.player.alive == 1) {
                if (this.player.isUbered) {
                    if (this.player.team == 3) 
                        return this.$parent.bluUberedIcon
                    else if (this.player.team == 2) 
                        return this.$parent.redUberedIcon
                }
                    
                if (this.player.weapon && this.player.weapon.index == 775 && this.player.isAllySpeedBuffed) {
                    return this.$parent.makredForDeathIcon
                }

                if (this.player.isBleeding) {
                    return this.$parent.bleedingIcon
                }

                if (parseInt(this.player.health) > parseInt(this.player.maxHealth)) {
                    return this.$parent.overhealIcon
                }
            }
        },

        getHealthClass () {
            if (this.player.alive == 1) {
                return {
                    'overhealed-color': parseInt(this.player.health) > parseInt(this.player.maxHealth)
                }
            }
        },

        getAmmo () {
            if (this.player.alive == 0) return `- / -`

            const pclass = this.player.class
            const clip = this.player.weapon.clip1 == -1 ? '-' : this.player.weapon.clip1
            const reserve = this.player.weapon.reserve == -1 ? '-' : this.player.weapon.reserve

            if (pclass == 5) {
                return `${parseInt(this.player.medigun.charge * 100)}%`
            } else if (pclass == 2 && this.player.weapon.class == 'CTFSniperRifle') {
                return `${reserve}`
            } else {
                return `${clip} / ${reserve}`
            }
        },
    }
}
</script>

<style lang="less">
.team-red-color {
    background: linear-gradient(90deg, @red-team-color-dark 0%, @red-team-color 100%);
}

.team-blue-color {
    background: linear-gradient(90deg, @blue-team-color-dark 0%, @blue-team-color 100%);
}

.player-center-bottom-bar {
    height: 4px;
    width: 100%;
}

.player-center-info {
    position: fixed;
    height: 100px;
    width: 400px;
    left: 0; right: 0;
    bottom: 78px;
    margin: auto;
    margin-bottom: 16px;

    .center-health-effect-icon {
        margin-top: auto;
        margin-bottom: 12px;
        height: 18px;
    }

    .player-center-health-info {
        height: 12px;
        width: 100%;
        display: flex;
        color: white;
        position: relative;
        background: rgba(0, 0, 0, 0.7);

        .player-center-health-bar-container {
            width: 100%;
            z-index: 1;

            .player-center-health-bar {
                position: absolute;
                top: 0; left: 0;
                height: 100%;
                transition: 0.3s;
                z-index: 3;
            }

            .player-center-health-bar-delay {
                position: absolute;
                top: 0; left: 0;
                height: 100%;
                transition: 0.3s;
                transition-delay: 0.5s;
                z-index: 1;
            }
        }

        .player-center-healthover-bar {
            position: absolute;
            bottom: 0; left: 0;
            height: 4px;
            background: @overheal-color;
            transition: 0.3s;
            z-index: 3;
        }

        .player-main-info-red {
            background: @red-team-color;
        }

        .player-main-info-red-delay {
            background: rgba(red(@red-team-color), green(@red-team-color), blue(@red-team-color), 0.5);
        }

        .player-main-info-blu {
            background: @blue-team-color;
        }

        .player-main-info-blu-delay {
            background: rgba(red(@blue-team-color), green(@blue-team-color), blue(@blue-team-color), 0.5);            
        }
    }

    .player-main-info {
        height: 72px;
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

    .player-center-main-info {
        height: 80px;
        width: 100%;
        display: flex;
        color: white;
        background: rgba(0, 0, 0, 0.5);

        .player-center-basic-info {
            width: 100%;
            display: flex;
            flex-direction: column;

            .info-row-1 {
                width: 100%;
                margin-top: 4px;

                .player-center-class {
                    margin-top: auto;
                    margin-bottom: auto;
                    margin-left: 16px;
                    height: 40px;
                }

                .player-center-disguise-class {
                    margin-top: 24px;
                    margin-bottom: -2px;
                    margin-left: -20px;
                    margin-right: -8px;
                    height: 24px;
                }

                .player-center-health {
                    margin-bottom: auto;
                    margin-top: 0px;
                    margin-left: auto;
                    margin-right: 16px;
                    font-size: 32px;
                    font-weight: 900;
                    display: flex;
                    flex-direction: row;

                    .overhealed-color {
                        color: @overheal-color;
                    }

                    .bluubered-color {
                        color: @blue-team-color;
                    }

                    .redubered-color {
                        color: @red-team-color;
                    }
                }

                .player-center-name {
                    margin-top: 14px; 
                    margin-left: 16px;
                    font-size: 28px;
                    line-height: 20px;
                }
            }

            .info-row-2 {
                .player-center-stats {
                    margin-top: -8px;    
                    margin-left: 64px;
                    font-size: 18px;
                    display: flex;
                    flex-direction: row;

                    span {
                        margin-left: 8px;
                        margin-right: 8px;
                        opacity: 0.67;
                    }

                    .player-center-ammo {
                        height: 16px;
                        display: flex;
                        flex-direction: row;
                        margin-right: 8px;
                        margin-left: auto;

                        img {   
                            margin-top: -4px;
                            height: 32px;
                        }

                        span {
                            font-size: 18px;
                        }
                    }
                }
            }
        }
    }
}
</style>
