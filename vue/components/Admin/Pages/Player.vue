<template>
    <div class='admin-page flex mb-4' id='player-page'>
        <div class='team w-1/2 h-12' id='player-edit-form'>
            <div class='title'>
                <span>Player Information</span>
            </div>
        </div>
        <div class='team w-1/2 h-12' id='player-extra'>
        </div>
    </div>    
</template>

<script>
export default {
    data () {
        return {
            
        }
    },

    async created () {

    }
}
</script>

<style lang="less">
.title {
    color: @text-color;
    font-size: 24px;
    font-weight: 900;
    text-transform: uppercase;
    margin-left: 32px;
    margin-bottom: 32px;
}
</style>
