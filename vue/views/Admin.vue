<template>
    <div class='admin-container'>
        <TopBar v-if="isElectron"/>
        <Sidebar />
        <div id='content'>
            <TeamPage v-if='currentTab === 0' />
            <PlayerPage v-else-if='currentTab === 1' />
            <SeriesPage v-else-if='currentTab === 2' />
            <TickerPage v-else-if='currentTab === 3' />
            <HudPage v-else-if='currentTab === 4' />
        </div>
    </div>
</template>

<script>
import Sidebar from '@/components/Admin/Sidebar'
import TopBar from '@/components/Admin/TopBar'

import TeamPage from '@/components/Admin/Pages/Team'
import PlayerPage from '@/components/Admin/Pages/Player'
import SeriesPage from '@/components/Admin/Pages/Series'
import TickerPage from '@/components/Admin/Pages/Ticker'
import HudPage from '@/components/Admin/Pages/Hud'

export default {
    components: { Sidebar, TopBar, TeamPage, PlayerPage, SeriesPage, TickerPage, HudPage },
    data () {
        return {
            isElectron: false,
            currentTab: 0,
            config: {}
        }
    },
    created () {
        this.isElectron = this.$route.query.electron
    },
    sockets: {
        config (data) {
            this.config = data
        }
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
    width: 100%; height: 100%;
}

.toggle {
    display: flex;
    flex-direction: row;
    margin-right: 32px;

    label {
        margin-left: auto;
        margin-top: -4px;
    }
}

.field {
    display: flex;
    flex-direction: column;
    margin-right: 64px;

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

.title {
    color: @text-color;
    font-size: 24px;
    font-weight: 900;
    text-transform: uppercase;
    margin-left: 32px;
    margin-bottom: 32px;
    display: flex;
    flex-direction: row;

    .actionbar {
        width: 108px;
        margin: auto;
        margin-right: 32px;
        display: flex;
        flex-direction: row;

        span {
            margin-left: auto;
            cursor: pointer;
        }
    }
}

.subtitle {
    color: @text-color;
    font-size: 18px;
    font-weight: 900;
    text-transform: uppercase;
    margin-left: 32px;
    display: flex;
    flex-direction: row;

    .actionbar {
        width: 108px;
        margin: auto;
        margin-right: 36px;
        display: flex;
        flex-direction: row;

        span {
            margin-left: auto;
            cursor: pointer;
        }
    }
}

.submit-fab {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 4px solid #fff;
    color: #fff;
    position: fixed;
    bottom: 32px; right: 32px;
    font-size: 24px;
    cursor: pointer;
    display: flex;

    i {
        margin: auto;
    }
}

.submit-dialog-fab {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 4px solid #fff;
    color: #fff;
    position: absolute;
    bottom: 96px; right: 32px;
    font-size: 24px;
    cursor: pointer;
    display: flex;

    i {
        margin: auto;
    }
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: @primary-color;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: @secondary-color;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: white;
}

input:focus + .slider {
  box-shadow: 0 0 1px white;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
