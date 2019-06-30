<template>
    <div class="container">
        <div class="team-blue">
            <Uber v-if="bluMedic" :player='bluMedic' />
            <div v-for="(player, key) of sortedPlayers" :key="`team3_${key}`">
                <TeamPlayer v-if="player.team == 3" :player="player" />
            </div>
        </div>
        <div class="team-red">
            <Uber v-if="redMedic" :player='redMedic' />
            <div v-for="(player, key) of sortedPlayers" :key="`team2_${key}`">
                <TeamPlayer v-if="player.team == 2" :player="player" />
            </div>
        </div>
    </div>
</template>

<script>
import TeamPlayer from "@/components/Hud/TeamPlayer"
import Uber from "@/components/Hud/Uber"

export default {
    components: { TeamPlayer, Uber },
    props: [ 'players' ],
    data () {
        return {
            sortedPlayers: null,
            bluMeidc: null,
            redMeidc: null,
        }
    },
    watch: {
        players: {
            immediate: true, 
            handler () {
                const players = []
                const order = [ 5, 4, 3, 1, 7, 2, 8, 6, 9 ]

                if (!this.players || this.players.length == 0) {
                    this.sortedPlayers = null
                    this.bluMeidc = null
                    this.redMeidc = null

                    return
                }
                
                for (let o of order) {
                    for (let p in this.players) {
                        if (this.players[p].class == o) players.push(this.players[p])

                        if (this.players[p].class == 5) { 
                            if (this.players[p].team == 3) this.bluMedic = this.players[p]
                            else if (this.players[p].team == 2) this.redMedic = this.players[p]
                        }
                    }
                }

                this.sortedPlayers = players
            }
        }
    }
}
</script>


<style lang="less">
.container {
    display: flex;
    width: 100vw;
    height: 100vh;

    .team-blue {
        position: fixed;
        left: 2px;
        bottom: 32px;
    }

    .team-red {
        position: fixed;
        right: 2px;
        bottom: 32px;
    }
}
</style>