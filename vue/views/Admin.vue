<template>
    <div class='admin-container'>
        <Topbar v-if="isElectron"/>
        <Sidebar />
        <div id='content'>
            <TeamPage v-if='currentTab == 0' />
        </div>
    </div>
</template>

<script>
import Sidebar from '@/components/Admin/Sidebar'
import Topbar from '@/components/Admin/Topbar'

import TeamPage from '@/components/Admin/Pages/Team'

import io from 'socket.io-client'

export default {
    components: { Sidebar, Topbar, TeamPage },
    data () {
        return {
            socket: '',
            isElectron: false,
            currentTab: 0
        }
    },
    created () {
        console.log(window.type)
        this.socket = io(`http://${process.env.VUE_APP_ELECTRON_HOST}:${process.env.VUE_APP_ELECTRON_SOCKET_PORT}`)
        this.isElectron = this.$route.query.electron
    }
}
</script>

<style lang="less">
.admin-container {
    width: 100vw;
    height: 100vh;
    background: @secondary-color;

    #content {
        width: calc(100vw - 196px);
        height: calc(100vh - 64px);
        position: fixed;
        top: 64px; left: 196px;
    }
}

.admin-page {
    display: flex;
    width: 100%; height: 100%;
}

.field {
    display: flex;
    flex-direction: column;

    label {
        color: lighten(@primary-color, 75);
        text-transform: uppercase;
        font-size: 12px;
        font-weight: 700;
        margin-left: 32px;
    }

    .input {
        margin-top: 2px;
        margin-bottom: 16px;
    }

    .fas {
        color: white;
    }
}

.input {
    height: 24px;
    margin: 0 32px;
    background: @secondary-color;
    border: none;
    border-bottom: 2px solid lighten(@primary-color, 75);
    color: white;
}
</style>
