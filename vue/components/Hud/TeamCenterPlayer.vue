<template>
    <div class="player-center-info">
        <div class='player-center-health-info'>
            <div class='player-center-health-bar-container '>
                <div class='player-center-health-bar' :class='{ "team-red-color": parseInt(player.team) === 2, "team-blue-color": parseInt(player.team) === 3}' :style='{ width: getBarWidth() }'></div>
                <div class='player-center-health-bar-delay' :style='{ width: getBarWidth() }'></div>
            </div>
            <div class='player-center-healthover-bar' :class='{ "team-red-color": parseInt(player.team) === 2, "team-blue-color": parseInt(player.team) === 3}' :style='{ width: getOverhealBarWidth() }'></div>
        </div>
        <div class='player-center-main-info'>
            <div class='player-center-basic-info'>
                <div class='flex info-row-1'>
                    <img class='player-center-class' :class='{ "player-center-class-transparent": player.isCloaked }' :src='player.alive ? $parent.classIcons[player.class] : $parent.skullIcon' />
                    <img v-if="player.disguise" :class='{ "player-center-disguise-class": getDisguiseClassIcon(), "player-disguise-class-red": player.disguise.team === 2, "player-disguise-class-blue": player.disguise.team === 3 }' :src='getDisguiseClassIcon()' />
                    <div class='player-center-name'>
                        <span>{{ getName() }}</span>
                    </div>
                    <div class="player-center-health">   
                        <img class='center-health-effect-icon' :src='getHealthEffectIcon()' />
                        <span :class='getHealthClass()'>{{ player.alive ? player.health : parseInt(player.respawnTime) > 0 ? `${parseInt(player.respawnTime)}s` : `1s` }}</span>
                    </div>     
                </div>
                <div class='info-row-2'>
                    <div class='player-center-stats' v-if="parseInt(player.class) === 5">
                        <span>D {{ player.deaths }}</span>
                        <span v-if="player.assists">A {{ player.assists }}</span>
                        <span>H {{ player.healing }}</span>
                        <div class='player-center-ammo' v-if='player.alive'>
                            <img class='player-center-ammo-icon' :src='$parent.ammoIcon' />
                            <span class='player-center-ammo-value'>{{ getAmmo() }}</span>
                        </div>
                    </div>
                    <div class='player-center-stats' v-else>
                        <span>K {{ player.kills }}</span>
                        <span>D {{ player.deaths }}</span>
                        <span>{{ getDamage() }}</span>
                        <div class='player-center-ammo' v-if='player.alive'>
                            <img class='player-center-ammo-icon' :src='$parent.ammoIcon' />
                            <span class='player-center-ammo-value'>{{ getAmmo() }}</span>
                        </div>
                    </div>
                </div>
            </div>      
        </div>
        <div class='player-center-bottom-bar' :class='{ "team-red-color": parseInt(player.team) === 2, "team-blue-color": parseInt(player.team) === 3}'></div>
    </div>
</template>

<script>
export default {
    props: ["player"],
    methods: {
        getName () {
            const player = this.player;
            const cache = this.$parent.playerCache;

            let name;

            if (cache[player.steamid]) {
                name = cache[player.steamid].name;
            } else {
                name = player.name;
            }

            if (name.length > 15) {
                name = `${name.substring(0, 15)}...`;
            }

            return name;
        },

        getClass () {
            const player = this.player;
            const value = parseInt(player.class);

            if (value === 1) return "Scout";
            else if (value === 2) return "Sniper";
            else if (value === 3) return "Soldier";
            else if (value === 4) return "Demoman";
            else if (value === 5) return "Medic";
            else if (value === 6) return "Heavy";
            else if (value === 7) return "Pyro";
            else if (value === 8) return "Spy";
            else if (value === 9) return "Engineer";
            else return "Unknown"
        },

        getDisguiseClassIcon() {
            if (parseInt(this.player.class) === 8 && parseInt(this.player.disguise.class) > 0) {
                return this.$parent.classIcons[this.player.disguise.class];
            }

            return false
        },
        
        getBarWidth() {
            if (this.player.alive) {
                let width = (this.player.health / this.player.maxHealth) * 100;

                if (width > 100) width = 100;

                return `${parseInt(width)}%`;
            }

            return "0%"
        },
        
        getOverhealBarWidth() {
            const overheal = [ 0, 185, 185, 300, 260, 225, 450, 260, 185, 185 ];

            if (this.player.alive && parseInt(this.player.health) > parseInt(this.player.maxHealth)) {
                const maxoverheal = overheal[this.player.class];
                const overhealth = maxoverheal - parseInt(this.player.maxHealth);
                const curoverhealth = parseInt(this.player.health) - parseInt(this.player.maxHealth);

                let width = (curoverhealth / overhealth) * 100;

                if (width > 100) width = 100;

                return `${parseInt(width)}%`
            }

            return "0%"
        },

        getHealthEffectIcon () {
            if (this.player.alive) {
                if (this.player.isUbered) {
                    if (parseInt(this.player.team) === 3)
                        return this.$parent.bluUberedIcon;
                    else if (parseInt(this.player.team) === 2)
                        return this.$parent.redUberedIcon
                }
                    
                if (this.player.weapon && parseInt(this.player.weapon.index) === 775 && this.player.isAllySpeedBuffed) {
                    return this.$parent.markedForDeathIcon
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
            if (this.player.alive) {
                return {
                    'overhealed-color': parseInt(this.player.health) > parseInt(this.player.maxHealth)
                }
            }
        },

        getAmmo () {
            if (!this.player.alive) return `- / -`;

            const pclass = parseInt(this.player.class);
            const clip = parseInt(this.player.weapon.clip1) === -1 ? '-' : this.player.weapon.clip1;
            const reserve = parseInt(this.player.weapon.reserve) === -1 ? '-' : this.player.weapon.reserve;

            if (pclass === 5 && this.player.weapon.class === 'CWeaponMedigun') {
                return `${parseInt(this.player.medigun.charge * 100)}%`
            } else if (pclass === 2 && this.player.weapon.class === 'CTFSniperRifle') {
                return `${reserve}`
            } else if (clip === "-" && reserve !== "-") {
               return `${reserve}`
            } else {
                return `${clip} / ${reserve}`
            }
        },

        getDamage () {
            const tDmg = this.player.totalDamage || this.player.damage;
            const matchtime = this.$parent.info.round.matchTimeLeft;
            const offset = this.$parent.config.matchTimeLeftOffset || 0;
            const time = (30 * 60) - matchtime - offset;
            const mins = time / 60;

            if (mins > 0) return `DPM ${parseInt(tDmg / mins)}`;
            else return `DPM 0`
        }
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
                    transition: 0.5s;
                }

                .player-center-class-transparent {
                    opacity: 0.5;
                }

                .player-center-disguise-class {
                    margin-top: 24px;
                    margin-bottom: -2px;
                    margin-left: -20px;
                    margin-right: -8px;
                    height: 24px;
                }

                .player-disguise-class-blue {
                    filter: invert(49%) sepia(83%) saturate(7137%) hue-rotate(194deg) brightness(95%) contrast(103%);
                }

                .player-disguise-class-red {
                    filter: invert(32%) sepia(100%) saturate(6987%) hue-rotate(15deg) brightness(91%) contrast(113%);
                }

                .player-center-health {
                    margin-bottom: auto;
                    margin-top: 0;
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
