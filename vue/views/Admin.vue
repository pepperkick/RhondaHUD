<template>
    <div class='admin-container'>
        <Topbar v-if="isElectron"/>
        <Sidebar />
    </div>
</template>

<script>
import Sidebar from '@/components/Admin/Sidebar'
import Topbar from '@/components/Admin/Topbar'

import io from 'socket.io-client'

export default {
    components: { Sidebar, Topbar },
    data () {
        return {
            socket: '',
            isElectron: false,
            currentTab: 0
        }
    },
    created () {
        console.log(window.type)
        this.socket = io(`http://127.0.0.1:${process.env.VUE_APP_ELECTRON_SOCKET_PORT}`)
        this.isElectron = this.$route.query.electron
    }
}
</script>

<style lang="less">
    .admin-container {
        width: 100vw;
        height: 100vh;
        background: @secondary-color;
    }
</style>
