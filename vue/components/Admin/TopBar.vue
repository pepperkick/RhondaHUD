<template>
    <div id='topbar'>
        <div id="close-button" @click="closeWindow">
            <span><i class='fas fa-times'></i></span>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        closeWindow () {
            this.$parent.socket.emit('admin-close', '')
        }
    }
}
</script>

<style lang="less">
    #topbar {
        position: fixed;
        top: 0; left: 0;
        width: 100vw;
        height: 32px;
        background: @primary-color;
        display: flex;
        -webkit-app-region: drag;

        #close-button {
            width: 48px;
            height: 32px;
            margin: auto;
            margin-right: 0;
            color: #ffffff;
            display: flex;
            background: @red-team-color;
            cursor: pointer;

            span {
                margin: auto;
            }
        }
    }
</style>
