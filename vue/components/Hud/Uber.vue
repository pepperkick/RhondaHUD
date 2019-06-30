<template>
    <div>
        <div class="uber-info align-side-blu" v-if='player.team == 3'>
            <div class="uber-info-container">
                <div class="uber-health-info">
                    <div class='uber-health-bar uber-bar-blu' :style='{ width: getBarWidth() }'></div>
                </div>
                <div class='uber-main-info'>
                    <img class='uber-icon' :src='medigunIcons[player.medigun.type]' />      
                    <div class='uber-type'>
                        <span>{{ GetMedigunName() }}</span>
                    </div>
                    <span class="uber-health">{{ parseInt(player.medigun.charge * 100) }}%</span>   
                </div>
            </div>
        </div>
        <div class="uber-info align-side-red" v-if='player.team == 2'>
            <div class="uber-info-container">
                <div class="uber-health-info">
                    <div class='uber-health-bar uber-bar-red' :style='{ width: getBarWidth() }'></div>
                </div>
                <div class='uber-main-info'>
                    <span class="uber-health">{{ parseInt(player.medigun.charge * 100) }}%</span>
                    <div class='uber-type'>
                        <span>{{ GetMedigunName() }}</span>
                    </div>
                    <img class='uber-icon' :src='medigunIcons[player.medigun.type]' />                
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["player"],
    data () {
        return {
            medigunIcons: {
                Unknown: require('@/assets/icons/status_effects/uber.png'),
                MediGun: require('@/assets/icons/status_effects/uber.png'),
                Kritzkrieg: require('@/assets/icons/status_effects/kritz.png'),
                QuickFix: require('@/assets/icons/status_effects/quickfix.png'),
                Vaccinator: require('@/assets/icons/status_effects/uber.png'),      //TODO: Add proper icon
            }
        }    
    },
    methods: {
        getClass () {
            const player = this.player;

            if (player.class == 1) return "Scout"
            else if (player.class == 2) return "Sniper"
            else if (player.class == 3) return "Soldier"
            else if (player.class == 4) return "Demoman"
            else if (player.class == 5) return "Medic"
            else if (player.class == 6) return "Heavy"
            else if (player.class == 7) return "Pyro"
            else if (player.class == 8) return "Spy"
            else if (player.class == 9) return "Engineer"
            else return "Unknown"
        },
        
        getBarWidth() {
            if (this.player.alive == 1) {
                let width = this.player.medigun.charge * 100;

                if (width > 100) width = 100;

                return `${parseInt(width)}%`;
            }

            return "0%"
        },
        
        GetMedigunName() {
            const medigun = this.player.medigun.type

            switch (medigun) {
                case 'Unknown': return 'MediGun'
                case 'MediGun': return 'MediGun'
                case 'Kritzkrieg': return 'Kritzkrieg'
                case 'QuickFix': return 'QuickFix'
                case 'Vaccinator': return 'Vaccinator'
            }
        }
    }
}
</script>

<style lang="less">
.uber-info-container {
    display: flex;
    flex-direction: column;
    height: 56px;
    width: 320px;
    margin-bottom: 16px;
    position: relative;
    background: rgba(0, 0, 0, 0.5);

    .uber-health-info {
        height: 24px;
        width: 100%;
        display: flex;
        color: white;
        position: relative;
        background: rgba(0, 0, 0, 0.25);

        .uber-health-bar {
            height: 100%;
            transition: 0.3s;
        }

        .uber-bar-red {
            background: linear-gradient(270deg, @red-team-color-dark 0%, @red-team-color 100%);
        }

        .uber-bar-blu {
            background: linear-gradient(90deg, @blue-team-color-dark 0%, @blue-team-color 100%);
        }
    }

    .uber-main-info {
        height: 72px;
        width: 100%;
        display: flex;
        flex-direction: row;
        color: white;

        .uber-health {
            margin-top: auto;
            margin-bottom: 0px;
            font-size: 32px;
            font-weight: 900;
        }

        .uber-icon {
            margin-top: auto;
            margin-bottom: auto;
            margin-left: 12px;
            margin-right: 12px;
            height: 32px;
        }

        .uber-type {
            margin-top: auto;
            margin-bottom: auto;    
            font-size: 20px;
            line-height: 20px;
        }
    }
}

.align-side-blu {
    .uber-info-container {
        margin-right: auto;
        margin-left: 0;
        border-left: 8px solid @blue-team-color-dark;
    }

    .uber-health-bar {
        position: absolute;
        top: 0; left: 0;
    }

    .uber-health {            
        margin-left: auto;
        margin-right: 12px;
    }
    
    .uber-type {
        margin-left: 8px;
    }
}

.align-side-red {
    .uber-info-container {
        margin-left: 100px !important;
        margin-right: 0;
        border-right: 8px solid @red-team-color-dark;
    }

    .uber-health-bar {
        position: absolute;
        top: 0; right: 0;
    }

    .uber-health {            
        margin-right: auto;
        margin-left: 12px;
    }
    
    .uber-type {
        margin-right: 8px;
    }

    .uber-main-info {
        text-align: right;
    }
}
</style>
