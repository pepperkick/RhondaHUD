<template>
    <div v-if="activePlayer.mode === 4 && player.isZoomed">
        <span id="sniper-headshots-stats">Headshots: {{ player.totalHeadshots }}</span>
    </div>
</template>

<script>
    export default {
        props: [ 'player', 'activePlayer' ],
        name: "SniperScopeStats",
    }
</script>

<style scoped>
#sniper-headshots-stats {
    position: fixed;
    top: calc(50% + 8px);
    left: calc(50% + 144px);
    text-transform: uppercase;
    font-size: 24px;
    font-weight: 800;
    color: #a38553;
}
</style>