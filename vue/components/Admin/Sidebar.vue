<template>
    <div id='sidebar'>
        <div class='sidebar-logo'>
            <img src='@/assets/logo.png' />
        </div>
        <div class='sidebar-item' :class="{ 'sidebar-item-active': $parent.currentTab == 0 }" @click="changeTab(0)">
            <i class='fas fa-users'></i>
            <span class='label'>Teams</span>
        </div>
        <div class='sidebar-item' :class="{ 'sidebar-item-active': $parent.currentTab == 1 }" @click="changeTab(1)">
            <i class='fas fa-user'></i>
            <span class='label'>Players</span>
        </div>
        <div class='sidebar-item' :class="{ 'sidebar-item-active': $parent.currentTab == 2 }" @click="changeTab(2)">
            <i class='fas fa-dice'></i>
            <span class='label'>Series</span>
        </div>
        <div class='sidebar-item' :class="{ 'sidebar-item-active': $parent.currentTab == 3 }" @click="changeTab(3)">
            <i class='fas fa-bullhorn'></i>
            <span class='label'>Messages</span>
        </div>
        <div class='sidebar-item' :class="{ 'sidebar-item-active': $parent.currentTab == 3 }" @click="changeTab(4)">
            <i class='fas fa-desktop'></i>
            <span class='label'>HUD</span>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    methods: {
        changeTab (i) {
            this.$parent.currentTab = i
        }
    }
}
</script>

<style lang="less">
    #sidebar {
        position: fixed;
        top: 0; left: 0;
        width: 196px;
        height: 100vh;
        background: @primary-color;

        .sidebar-logo {
            margin-top: 32px;
            margin-bottom: 64px;
            height: 48px;
            width: 100%;
            display: flex;

            img {
                height: 96px;       
                margin: auto;
            }
        }

        .sidebar-item-active {
            background: lighten(@primary-color, 5);
        }

        .sidebar-item {
            color: white;
            display: flex;
            height: 56px;
            transition: 0.3s;
            cursor: pointer;

            .fas {
                width: 48px;
                height: 48px;
                line-height: 48px;
                font-size: 24px;
                opacity: 0.88;
                margin: auto 0 auto 32px;
            }

            .fab {
                width: 48px;
                height: 48px;
                line-height: 48px;
                font-size: 24px;
                opacity: 0.88;
                margin: auto 0 auto 32px;
            }

            .label {
                font-size: 16px;
                font-weight: 300;
                opacity: 0.55;
                margin: auto auto auto 0;
            }
        }

        .sidebar-item:hover {
            background: lighten(@secondary-color, 10);
        }
    }
</style>
