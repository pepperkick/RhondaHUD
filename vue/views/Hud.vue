<template>
    <div class='container'>
        <TeamContainer :players='info.allplayers' />
        <TeamCenterPlayer v-if='info.player' :player='info.allplayers[info.player.steamid]' />
        <RoundInfo v-if='info.round' :round='info.round' :teams='info.teams' />
        <ControlPoints v-if='info.round' :round='info.round' />
    </div>
</template>

<script>
import TeamContainer from '@/components/Hud/TeamContainer'
import TeamCenterPlayer from '@/components/Hud/TeamCenterPlayer'
import RoundInfo from '@/components/Hud/RoundInfo'
import ControlPoints from '@/components/Hud/ControlPoints'

function hexToRgbA(hex, alpha) {
    let c;

    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('')
        if (c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x'+c.join('')
        return `rgba(${[(c>>16)&255, (c>>8)&255, c&255].join(',')}, ${alpha})`
    }

    throw new Error('Bad Hex')
}

export default {
    components: { TeamContainer, TeamCenterPlayer, RoundInfo, ControlPoints },
    data () {
        return {
            info: '',
            swap: false,
            functions: {
                hexToRgbA
            }
        }
    },
    watch: {

    },
    sockets: {
        data: function (data) {
            this.info = data
        }
    }
}
</script>

<style lang="less">
</style>
