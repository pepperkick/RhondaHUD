<template>
    <div class="container">
        <div class="team-blue">
            <div v-for="(player, key) of players" :key="`team3_${key}`">
                <TeamPlayer v-if="player.team == 3" :player="player" />
            </div>
        </div>
        <div class="team-red">
            <div v-for="(player, key) of players" :key="`team2_${key}`">
                <TeamPlayer v-if="player.team == 2" :player="player" />
            </div>
        </div>
    </div>
</template>

<script>
import TeamPlayer from "@/components/TeamPlayer"

export default {
    components: { TeamPlayer },
    props: [ 'players' ]
}
</script>


<style lang="less">
.container {
    display: flex;
    width: 100vw;
    height: 100vh;

    .team-blue {
        position: fixed;
        left: 64px;
        bottom: 32px;
    }

    .team-red {
        position: fixed;
        right: 64px;
        bottom: 32px;
    }
}
</style>