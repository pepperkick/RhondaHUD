<template>
    <div class="admin-page" id='hud-page'>
        <div class='title'>
            <span>HUD Features</span>
        </div>
        <div class='flex mb-4'>
            <div class='flex flex-col w-full h-12' id='hud-extra'>
                <div class='subtitle'>
                    <span>Experimental Features</span>
                </div>
                <br />
                <div class="feature">
                    <div class="toggle">
                        <div class='subtitle'>
                            <span>Sniper Scope Text</span>
                        </div>
                        <label class="switch">
                          <input type="checkbox" v-model="sniperScopeStats">
                          <span class="slider round"></span>
                        </label>
                    </div>
                    <div class='description'>
                        <span>Show extra stats for sniper when scoped in.<br>Requires GSI v1.1.3</span>
                    </div>
                </div>
                <br />
                <div class="feature">
                    <div class="toggle">
                        <div class='subtitle'>
                            <span>Force Slim Mode</span>
                        </div>
                        <label class="switch">
                          <input type="checkbox" v-model="forceSlimHud">
                          <span class="slider round"></span>
                        </label>
                    </div>
                    <div class='description'>
                        <span>Force the HUD to use slim mode even when there are less then 14 players.</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    export default {
        name: "Hud",
        data () {
            return {
                sniperScopeStats: false,
                forceSlimHud: false
            }
        },
        methods: {
            async update () {
                this.sniperScopeStats = this.$parent.config.experimental.sniperScopeStats || false;
                this.forceSlimHud = this.$parent.config.experimental.forceSlimHud || false;
            }
        },
        watch: {
            sniperScopeStats: {
                deep: true,
                async handler() {
                    this.$socket.emit('set-config', 'experimental.sniperScopeStats', this.sniperScopeStats);
                }
            },
            forceSlimHud: {
                deep: true,
                async handler() {
                    this.$socket.emit('set-config', 'experimental.forceSlimHud', this.forceSlimHud);
                }
            },
        },
        async created () {
            this.update()
        }
    }
</script>

<style lang="less" scoped>
.description {
    color: white;
    margin-left: 32px;
}
</style>