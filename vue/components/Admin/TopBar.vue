<template>
    <div id="topbar-container">
        <div id='drag-space'>
        </div>
        <div id="close-button" @click="closeWindow()">
            <span><i class='fas fa-times'></i></span>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        closeWindow () {
            console.log("click");
            this.$socket.emit('admin-close');
        }
    }
}
</script>

<style lang="less">
    #topbar-container {
        position: fixed;
        top: 0; left: 0;
        width: 100vw;
        height: 32px;
        display: flex;
        flex-direction: row;

        #drag-space {
            width: 100vw;
            height: 100%;
            background: @primary-color;
            -webkit-app-region: drag;
        }

        #close-button {
            width: 48px;
            height: 32px;
            margin: auto;
            margin-right: 0;
            color: #ffffff;
            display: flex;
            background: @red-team-color;
            cursor: pointer;
            z-index: 5;

            span {
                margin: auto;
            }
        }
    }
</style>
