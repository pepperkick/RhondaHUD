<template>
    <div class="player-info-container">
        <div class='player-stats-container align-side-blu' v-if='parseInt(player.team) === 3'>
            <div class="player-info" :class="{ 'player-main-info-glow': active }" >
                <div class="player-health-info">
                    <div class='player-health-bar-container'>
                        <div class='player-health-bar player-main-info-blu' :style='{ width: getBarWidth() }'></div>
                        <div class='player-health-bar-delay player-main-info-blu-delay' :style='{ width: getBarWidth() }'></div>
                    </div>
                    <div class='player-healthover-bar' :style="{ width: getOverhealBarWidth() }"></div>
                </div>
                <div class='player-main-info'>
                    <img class='player-class' :src='player.alive ? $parent.$parent.classIcons[player.class] : $parent.$parent.skullIcon' />
                    <div class='player-basic-info'>
                        <div class='info-row-1 player-name'>
                            <span>{{ getName() }}</span>
                        </div>
                        <div class='info-row-2 player-stats' v-if="parseInt(player.class) === 5">
                            <span>D {{ player.deaths }}</span>
                            <span v-if="player.assists">A {{ player.assists }}</span>
                            <span>H {{ player.healing }}</span>
                        </div>
                        <div class='info-row-2 player-stats' v-else>
                            <span>K {{ player.kills }}</span>
                            <span>D {{ player.deaths }}</span>
                            <span>{{ getDamage() }}</span>
                        </div>
                    </div>
                    <div class="player-health">
                        <img class='health-effect-icon' :src='getHealthEffectIcon()' />
                        <span :class='getHealthClass()'>{{ player.alive ? player.health : parseInt(player.respawnTime) > 0 ? `${parseInt(player.respawnTime)}s` : `1s` }}</span>
                    </div>     
                </div>
            </div>
            <div class='player-extra-stats' v-if='player.alive'>
                <div class='player-status-icons'>
                    <!-- <img class='player-status-icon' v-for='(i, index) in statusEffects' :key='index' :src='i' /> -->
                </div>
                <img class='player-weapon-icon' :src='getWeaponIcon()' />
            </div>
        </div>
        <div class='player-stats-container align-side-red' v-if='parseInt(player.team) === 2'>
            <div class='player-extra-stats' v-if='player.alive'>
                <div class='player-status-icons'>
                    <!-- <img class='player-status-icon' v-for='(i, index) in statusEffects' :key='index' :src='i' /> -->
                </div>
                <img class='player-weapon-icon' :src='getWeaponIcon()' />
            </div>
            <div class="player-info" :class="{ 'player-main-info-glow': active }" >
                <div class="player-health-info">
                    <div class='player-health-bar-container'>
                        <div class='player-health-bar player-main-info-red' :style='{ width: getBarWidth() }'></div>
                        <div class='player-health-bar-delay player-main-info-red-delay' :style='{ width: getBarWidth() }'></div>
                    </div>
                    <div class='player-healthover-bar' :style="{ width: getOverhealBarWidth() }"></div>
                </div>
                <div class='player-main-info'>
                    <div class="player-health">
                        <span :class='getHealthClass()'>{{ player.alive ? player.health : parseInt(player.respawnTime) > 0 ? `${parseInt(player.respawnTime)}s` : `1s` }}</span>
                        <img class='health-effect-icon' :src='getHealthEffectIcon()' />
                    </div>     
                    <div class='player-basic-info'>
                        <div class='info-row-1 player-name'>
                            <span>{{ getName() }}</span>
                        </div>
                        <div class='info-row-2 player-stats' v-if="parseInt(player.class) === 5">
                            <span>H {{ player.healing }}</span>
                            <span v-if="player.assists">A {{ player.assists }}</span>
                            <span>D {{ player.deaths }}</span>
                        </div>
                        <div class='info-row-2 player-stats' v-else>
                            <span>{{ getDamage() }}</span>
                            <span>D {{ player.deaths }}</span>
                            <span>K {{ player.kills }}</span>
                        </div>
                    </div>
                    <img class='player-class' :src='player.alive ? $parent.$parent.classIcons[player.class] : $parent.$parent.skullIcon' />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: [ 'player', 'active' ],
    data () {
        return {
            oldHealthBarWidth: '0',
            statusEffects: [],
        }    
    },
    methods: {
        getName () {
            const player = this.player;
            const cache = this.$parent.$parent.playerCache;

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
        
        getBarWidth() {
            if (this.player.alive) {
                let width = (parseInt(this.player.health) / parseInt(this.player.maxHealth)) * 100;

                if (width > 100) width = 100;

                return `${parseInt(width)}%`
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
                    return this.$parent.$parent.markedForDeathIcon
                }

                if (this.player.isBleeding) {
                    return this.$parent.$parent.bleedingIcon
                }

                if (parseInt(this.player.health) > parseInt(this.player.maxHealth)) {
                    return this.$parent.$parent.overhealIcon
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

        getWeaponIcon () {
            if (!this.player.alive) return;

            const wepindex = this.player.weapon.index;
            const wepclass = this.player.weapon.class;

            if (this.$parent.$parent.weaponIcons[wepclass]) {
                if (this.$parent.$parent.weaponIcons[wepclass][wepindex]) return this.$parent.$parent.weaponIcons[wepclass][wepindex];
                else return this.$parent.$parent.weaponIcons[wepclass][0]
            }
        },

        getDamage () {
            const tDmg = this.player.totalDamage || this.player.damage;
            const matchtime = this.$parent.$parent.info.round.matchTimeLeft;
            const offset = this.$parent.$parent.config.matchTimeLeftOffset || 0;
            const time = (30 * 60) - matchtime - offset;
            const mins = time / 60;

            if (mins > 0) return `DPM ${parseInt(tDmg / mins)}`;
            else return `DPM 0`
        }
    }
}
</script>

<style lang="less">
.player-stats-container {
    display: flex;
    flex-direction: row;
    height: 64px;
    width: 400px;
    margin: auto;
    margin-right: 0;
    margin-bottom: 8px;
    position: relative;

    .player-extra-stats {
        display: flex;
        flex-direction: column;
        width: 72px;

        .player-status-icons {
            height: 24px;
            filter: brightness(0) invert(1);

            img {
                height: 18px;
            }
        }

        .player-weapon-icon {
            filter: brightness(0) invert(1);
        }
    }
    
    .player-info {
        display: flex;
        flex-direction: column;
        height: 64px;
        width: 320px;
        margin-bottom: 12px;
        position: relative;
        background: rgba(0, 0, 0, 0.5);

        .health-effect-icon {
            margin-top: auto;
            margin-bottom: 12px;
            height: 18px;
        }

        .player-health-info {
            height: 12px;
            width: 100%;
            display: flex;
            color: white;
            position: relative;
            background: rgba(0, 0, 0, 0.25);

            .player-health-bar-container {
                width: 100%;
                z-index: 1;

                .player-health-bar {
                    height: 100%;
                    transition: 0.3s;
                    z-index: 3;
                }

                .player-health-bar-delay {
                    height: 100%;
                    transition: 0.3s;
                    transition-delay: 0.5s;
                    z-index: 1;
                }
            }

            .player-healthover-bar {
                height: 2px;
                background: @overheal-color;
                transition: 0.3s;
                z-index: 3;
            }

            .player-main-info-red {
                background: linear-gradient(270deg, @red-team-color-dark 0%, @red-team-color 100%);
            }

            .player-main-info-red-delay {
                background: rgba(red(@red-team-color), green(@red-team-color), blue(@red-team-color), 0.5);
            }

            .player-main-info-blu {
                background: linear-gradient(90deg, @blue-team-color-dark 0%, @blue-team-color 100%);
            }

            .player-main-info-blu-delay {
                background: rgba(red(@blue-team-color), green(@blue-team-color), blue(@blue-team-color), 0.5);            
            }
        }

        .player-main-info {
            height: 72px;
            width: 100%;
            display: flex;
            flex-direction: row;
            color: white;

            .player-health {
                margin-top: auto;
                margin-bottom: 0px;
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

            .player-class {
                margin-top: auto;
                margin-bottom: auto;
                margin-left: 8px;
                margin-right: 8px;
                height: 40px;
            }

            .player-basic-info {
                display: flex;
                flex-direction: column;

                .player-name {
                    margin-top: 6px;
                    margin-bottom: -4px;    
                    font-size: 20px;
                    line-height: 20px;
                }

                .player-stats {
                    margin-top: auto;
                    margin-bottom: auto;    
                    font-size: 14px;

                    span {
                        margin-left: 8px;
                        margin-right: 8px;
                        opacity: 0.67;
                    }
                }
            }
        }
    }

    .player-main-info-glow {
        transition: 0.3s;
    }
}

.align-side-blu {
    .player-info {
        margin-right: auto;
        margin-left: 0;
        border-left: 2px solid @blue-team-color-dark;
    }

    .player-health-bar {
        position: absolute;
        top: 0; left: 0;
    }
    
    .player-health-bar-delay {
        position: absolute;
        top: 0; left: 0;
    }

    .player-healthover-bar {
        position: absolute;
        bottom: 0; left: 0;
    }

    .player-health {            
        margin-left: auto;
        margin-right: 12px;
    }
    
    .player-name {
        margin-left: 8px;
    }

    .player-weapon-icon {
        margin-left: 0;
        margin-right: auto;
    }

    .player-status-icons {
        margin-left: 0;
        margin-right: auto;
    }
    
    .player-extra-stats {
        margin-left: 8px;
        margin-right: auto;
    }

    .player-main-info-glow {
        box-shadow: 0 0 8px 0 @blue-team-color-dark;
    }
}

.player-stats-container .align-side-red  {
    margin-right: 0 !important;
}

.align-side-red {
    .player-info {
        margin-left: auto;
        margin-right: 0;
        border-right: 2px solid @red-team-color-dark;
    }

    .player-health-bar {
        position: absolute;
        top: 0; right: 0;
    }
    
    .player-health-bar-delay {
        position: absolute;
        top: 0; right: 0;
    }

    .player-healthover-bar {
        position: absolute;
        bottom: 0; right: 0;
    }

    .player-health {            
        margin-right: auto;
        margin-left: 12px;
    }
    
    .player-name {
        margin-right: 8px;
    }

    .player-main-info {
        text-align: right;
    }

    .player-weapon-icon {
        transform: scaleX(-1);
        margin-right: 0;
        margin-left: auto;
    }

    .player-status-icons {
        transform: scaleX(-1);
        margin-right: 0;
        margin-left: auto;
    }

    .player-extra-stats {
        margin-right: 8px;
        margin-left: auto;
    }

    .player-main-info-glow {
        box-shadow: 0 0 8px 0 @red-team-color-dark;
    }
}
</style>
