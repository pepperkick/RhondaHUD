<template>
    <div class='container'>
        <TeamContainer :players='info.allplayers' :activePlayer='info.player' />
        <TeamCenterPlayer v-if='info.player' :player='info.allplayers[info.player.steamid]' />
        <RoundInfo v-if='info.round' :round='info.round' :teams='info.teams' />
        <ControlPoints v-if='info.round' :round='info.round' />
    </div>
</template>

<script>
import TeamContainer from '@/components/Hud/TeamContainer'
import TeamCenterPlayer from '@/components/Hud/TeamCenterPlayer'
import RoundInfo from '@/components/Hud/RoundInfo'
import ControlPoints from '@/components/Hud/ControlPoints'

function hexToRgbA(hex, alpha) {
    let c;

    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('')
        if (c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x'+c.join('')
        return `rgba(${[(c>>16)&255, (c>>8)&255, c&255].join(',')}, ${alpha})`
    }

    throw new Error('Bad Hex')
}

export default {
    components: { TeamContainer, TeamCenterPlayer, RoundInfo, ControlPoints },
    data () {
        return {
            info: '',
            config: '',
            playerCache: {},
            swap: false,
            functions: {
                hexToRgbA
            },
            classIcons: [ 
                '', 
                require('@/assets/icons/class_icons/Scout.png'),
                require('@/assets/icons/class_icons/Sniper.png'),
                require('@/assets/icons/class_icons/Soldier.png'),
                require('@/assets/icons/class_icons/Demo.png'),
                require('@/assets/icons/class_icons/Medic.png'),
                require('@/assets/icons/class_icons/Heavy.png'),
                require('@/assets/icons/class_icons/Pyro.png'),
                require('@/assets/icons/class_icons/Spy.png'),
                require('@/assets/icons/class_icons/Engineer.png'),
            ],
            weaponIcons: {
                'CTFPistol': {
                    '0': require('@/assets/icons/weapon_icons/multi_class/pistols/pistol.png'),
                    '23': require('@/assets/icons/weapon_icons/multi_class/pistols/pistol.png'),
                    '294': require('@/assets/icons/weapon_icons/multi_class/pistols/lugermorph.png'),
                    '30666': require('@/assets/icons/weapon_icons/multi_class/pistols/capper.png'),
                },
                'CTFShotgun_Soldier': {
                    '0': require('@/assets/icons/weapon_icons/multi_class/allclass_shotguns/shotguns.png'),   
                    '10': require('@/assets/icons/weapon_icons/multi_class/allclass_shotguns/shotguns.png'),   
                },
                'CTFShotgun_Pyro': {
                    '0': require('@/assets/icons/weapon_icons/multi_class/allclass_shotguns/shotguns.png'),   
                    '10': require('@/assets/icons/weapon_icons/multi_class/allclass_shotguns/shotguns.png'),   
                },
                'CTFShotgun_HWG': {
                    '0': require('@/assets/icons/weapon_icons/multi_class/allclass_shotguns/shotguns.png'),   
                    '10': require('@/assets/icons/weapon_icons/multi_class/allclass_shotguns/shotguns.png'),   
                    '425': require('@/assets/icons/weapon_icons/heavy/secondary/family_buisness.png'),
                },
                'CTFShotgun': {
                    '0': require('@/assets/icons/weapon_icons/multi_class/allclass_shotguns/shotguns.png'),  
                    '9': require('@/assets/icons/weapon_icons/multi_class/allclass_shotguns/shotguns.png'),   
                    '199': require('@/assets/icons/weapon_icons/multi_class/allclass_shotguns/shotguns.png'),   
                    '527': require('@/assets/icons/weapon_icons/engineer/primary/widowmaker.png'),   
                    '1153': require('@/assets/icons/weapon_icons/multi_class/allclass_shotguns/panic_attack.png'),   
                    '415': require('@/assets/icons/weapon_icons/multi_class/allclass_shotguns/reserve_shooter.png'),   
                },
                'CTFKatana': {
                    '0': require('@/assets/icons/weapon_icons/multi_class/limited_melees/half_zatoichi.png'),   
                    '357': require('@/assets/icons/weapon_icons/multi_class/limited_melees/half_zatoichi.png'),   
                },
                'CTFScatterGun': {
                    '0': require('@/assets/icons/weapon_icons/scout/primary/scattergun.png'),
                    '13': require('@/assets/icons/weapon_icons/scout/primary/scattergun.png'),
                    '1103': require('@/assets/icons/weapon_icons/scout/primary/back_scatter.png'),
                    '45': require('@/assets/icons/weapon_icons/scout/primary/force_of_nature.png'),
                },
                'CTFPistol_ScoutPrimary': {
                    '0': require('@/assets/icons/weapon_icons/scout/primary/shortstop.png'),     
                    '220': require('@/assets/icons/weapon_icons/scout/primary/shortstop.png'),          // TODO: Find proper class+
                },
                'CTFPEPBrawlerBlaster': {
                    '0': require('@/assets/icons/weapon_icons/scout/primary/baby_face_blaster.png'),
                    '772': require('@/assets/icons/weapon_icons/scout/primary/baby_face_blaster.png'),
                },
                'CTFPEPBrawlerBlaster': {
                    '0': require('@/assets/icons/weapon_icons/scout/primary/baby_face_blaster.png'),
                    '772': require('@/assets/icons/weapon_icons/scout/primary/baby_face_blaster.png'),
                },
                'CTFSodaPopper': {
                    '0': require('@/assets/icons/weapon_icons/scout/primary/soda_popper.png'),
                    '448': require('@/assets/icons/weapon_icons/scout/primary/soda_popper.png'),
                },
                'CTFPistol_ScoutSecondary': {
                    '0': require('@/assets/icons/weapon_icons/scout/secondary/winger.png'),
                    '449': require('@/assets/icons/weapon_icons/scout/secondary/winger.png'),
                    '773': require('@/assets/icons/weapon_icons/scout/secondary/pretty_boys_pocket_pistol.png'),
                },
                'CTFBat': {
                    '0': require('@/assets/icons/weapon_icons/scout/melee/bat.png'),
                    '317': require('@/assets/icons/weapon_icons/scout/melee/candy_cane.png'),
                    '325': require('@/assets/icons/weapon_icons/scout/melee/boston_basher.png'),
                    '349': require('@/assets/icons/weapon_icons/scout/melee/sun_on_a_stick.png'),
                    '355': require('@/assets/icons/weapon_icons/scout/melee/fan_of_war.png'),
                    '450': require('@/assets/icons/weapon_icons/scout/melee/atomizer.png'),
                    '452': require('@/assets/icons/weapon_icons/scout/melee/three_rune_blade.png'),
                    '30667': require('@/assets/icons/weapon_icons/scout/melee/batsaber.png'),
                },
                'CTFBat_Giftwrap': {
                    '0': require('@/assets/icons/weapon_icons/scout/melee/wrap_assassin.png'),
                    '648': require('@/assets/icons/weapon_icons/scout/melee/wrap_assassin.png'),
                    '44': require('@/assets/icons/weapon_icons/scout/melee/sandman.png'),
                },
                'CTFBat_Fish': {
                    '0': require('@/assets/icons/weapon_icons/scout/melee/holy_mackerel.png'),
                    '221': require('@/assets/icons/weapon_icons/scout/melee/holy_mackerel.png'),
                    '572': require('@/assets/icons/weapon_icons/scout/melee/unarmed_combat.png'),
                },
                'CTFRocketLauncher': {
                    '0': require('@/assets/icons/weapon_icons/soldier/primary/rocket_launcher.png'),       
                    '18': require('@/assets/icons/weapon_icons/soldier/primary/rocket_launcher.png'),       
                    '228': require('@/assets/icons/weapon_icons/soldier/primary/black_box.png'),            
                    '237': require('@/assets/icons/weapon_icons/soldier/primary/rocket_jumper.png'),                 
                    '414': require('@/assets/icons/weapon_icons/soldier/primary/liberty_launcher.png'),              
                    '513': require('@/assets/icons/weapon_icons/soldier/primary/original.png'),              
                    '730': require('@/assets/icons/weapon_icons/soldier/primary/beggars_bazooka.png'),              
                },
                'CTFRocketLauncher_DirectHit': {
                    '0': require('@/assets/icons/weapon_icons/soldier/primary/direct_hit.png'),       
                    '127': require('@/assets/icons/weapon_icons/soldier/primary/direct_hit.png'),      
                },
                'CTFRocketLauncher_AirStrike': {
                    '0': require('@/assets/icons/weapon_icons/soldier/primary/air_strike.png'),       
                    '1104': require('@/assets/icons/weapon_icons/soldier/primary/air_strike.png'),      
                },
                'CTFParticleCannon': {
                    '0': require('@/assets/icons/weapon_icons/soldier/primary/cow_mangler.png'),       
                    '441': require('@/assets/icons/weapon_icons/soldier/primary/cow_mangler.png'),      
                },
                'CTFRaygun': {
                    '0': require('@/assets/icons/weapon_icons/soldier/secondary/righteous_bison.png'),       
                    '442': require('@/assets/icons/weapon_icons/soldier/secondary/righteous_bison.png'),      
                },
                'CTFBuffItem': {
                    '0': require('@/assets/icons/weapon_icons/soldier/secondary/buff_banner.png'),       
                    '129': require('@/assets/icons/weapon_icons/soldier/secondary/buff_banner.png'),     
                    '226': require('@/assets/icons/weapon_icons/soldier/secondary/battalions_backup.png'),   
                    '354': require('@/assets/icons/weapon_icons/soldier/secondary/concherer.png'),     
                },
                'CTFShovel': {
                    '0': require('@/assets/icons/weapon_icons/soldier/melee/shovel.png'),       
                    '6': require('@/assets/icons/weapon_icons/soldier/melee/shovel.png'),      
                    '128': require('@/assets/icons/weapon_icons/soldier/melee/equilizer.png'),      
                    '416': require('@/assets/icons/weapon_icons/soldier/melee/market_gardener.png'),   
                    '447': require('@/assets/icons/weapon_icons/soldier/melee/displinary_action.png'),   
                    '775': require('@/assets/icons/weapon_icons/soldier/melee/escape_plan.png'),    
                    '154': require('@/assets/icons/weapon_icons/multi_class/limited_melees/pain_train.png'),  
                },
                'CTFFlameThrower': {
                    '0': require('@/assets/icons/weapon_icons/pyro/primary/flame_thrower.png'),
                    '21': require('@/assets/icons/weapon_icons/pyro/primary/flame_thrower.png'),
                    '40': require('@/assets/icons/weapon_icons/pyro/primary/backburner.png'),
                    '215': require('@/assets/icons/weapon_icons/pyro/primary/degreaser.png'),
                    '594': require('@/assets/icons/weapon_icons/pyro/primary/phlogistinator.png'),
                    '30474': require('@/assets/icons/weapon_icons/pyro/primary/nostromo_napalmer.png'),
                },
                'CTFFlareGun': {
                    '0': require('@/assets/icons/weapon_icons/pyro/secondary/flare_gun.png'),
                    '39': require('@/assets/icons/weapon_icons/pyro/secondary/flare_gun.png'),
                    '351': require('@/assets/icons/weapon_icons/pyro/secondary/detonator.png'),
                    '740': require('@/assets/icons/weapon_icons/pyro/secondary/scorch_shot.png'),
                },
                'CTFFlareGun_Revenge': {
                    '0': require('@/assets/icons/weapon_icons/pyro/secondary/manmelter.png'),
                    '595': require('@/assets/icons/weapon_icons/pyro/secondary/manmelter.png'),
                },
                'CTFRocketPack': {
                    '0': require('@/assets/icons/weapon_icons/pyro/secondary/thermal_thruster.png'),
                    '1179': require('@/assets/icons/weapon_icons/pyro/secondary/thermal_thruster.png'),
                },
                'CTFJarGas': {
                    '0': require('@/assets/icons/weapon_icons/pyro/secondary/gas_passer.png'),
                    '1180': require('@/assets/icons/weapon_icons/pyro/secondary/gas_passer.png'),
                },
                'CTFFireAxe': {
                    '0': require('@/assets/icons/weapon_icons/pyro/melee/fire_axe.png'),
                    '2': require('@/assets/icons/weapon_icons/pyro/melee/fire_axe.png'),
                    '38': require('@/assets/icons/weapon_icons/pyro/melee/axtinguisher.png'),
                    '153': require('@/assets/icons/weapon_icons/pyro/melee/homewrecker.png'),
                    '214': require('@/assets/icons/weapon_icons/pyro/melee/powerjack.png'),
                    '326': require('@/assets/icons/weapon_icons/pyro/melee/back_scratcher.png'),
                    '457': require('@/assets/icons/weapon_icons/pyro/melee/postal_pummeler.png'),
                    '348': require('@/assets/icons/weapon_icons/pyro/melee/sharpen_volcano_fragment.png'),
                    '466': require('@/assets/icons/weapon_icons/pyro/melee/maul.png'),
                    '593': require('@/assets/icons/weapon_icons/pyro/melee/third_degree.png'),
                    '739': require('@/assets/icons/weapon_icons/pyro/melee/lolichop.png'),
                },
                'CTFBreakableSign': {
                    '0': require('@/assets/icons/weapon_icons/pyro/melee/neon_annihilator.png'),
                    '813': require('@/assets/icons/weapon_icons/pyro/melee/neon_annihilator.png'),
                },
                'CTFGrenadeLauncher': {
                    '0': require('@/assets/icons/weapon_icons/demo/primary/grenade_launcher.png'),
                    '19': require('@/assets/icons/weapon_icons/demo/primary/grenade_launcher.png'),
                    '308': require('@/assets/icons/weapon_icons/demo/primary/loch_n_load.png'),
                    '1151': require('@/assets/icons/weapon_icons/demo/primary/iron_bomber.png'),
                },
                'CTFCannon': {
                    '0': require('@/assets/icons/weapon_icons/demo/primary/loose_cannon.png'),
                    '996': require('@/assets/icons/weapon_icons/demo/primary/loose_cannon.png'),
                },
                'CTFPipebombLauncher': {
                    '0': require('@/assets/icons/weapon_icons/demo/secondary/stickybomb_launcher.png'),
                    '20': require('@/assets/icons/weapon_icons/demo/secondary/stickybomb_launcher.png'),
                    '130': require('@/assets/icons/weapon_icons/demo/secondary/scottish_resistance.png'),
                    '265': require('@/assets/icons/weapon_icons/demo/secondary/sticky_jumper.png'),
                    '1150': require('@/assets/icons/weapon_icons/demo/secondary/quickiebomb_launcher.png'),
                },
                'CTFWearableDemoShield': {
                    '0': require('@/assets/icons/weapon_icons/demo/secondary/chargin_targe.png'),
                    '131': require('@/assets/icons/weapon_icons/demo/secondary/chargin_targe.png'),
                    '406': require('@/assets/icons/weapon_icons/demo/secondary/splendid_screen.png'),
                    '1099': require('@/assets/icons/weapon_icons/demo/secondary/tide_turner.png'),
                },
                'CTFBottle': {
                    '0': require('@/assets/icons/weapon_icons/demo/melee/bottle.png'),
                    '1': require('@/assets/icons/weapon_icons/demo/melee/bottle.png'),
                    '609': require('@/assets/icons/weapon_icons/demo/melee/scottish_handshake.png'),
                },
                'CTFSword': {
                    '0': require('@/assets/icons/weapon_icons/demo/melee/eyelander.png'),
                    '132': require('@/assets/icons/weapon_icons/demo/melee/eyelander.png'),
                    '172': require('@/assets/icons/weapon_icons/demo/melee/scotsmans_skullcutter.png'),
                    '266': require('@/assets/icons/weapon_icons/demo/melee/horseless_headless_horsemanns_headtaker.png'),
                    '327': require('@/assets/icons/weapon_icons/demo/melee/claidheamh_mor.png'),
                    '404': require('@/assets/icons/weapon_icons/demo/melee/persian_persuader.png'),
                    '482': require('@/assets/icons/weapon_icons/demo/melee/nessie_nine_iron.png'),
                },
                'CTFStickBomb': {
                    '0': require('@/assets/icons/weapon_icons/demo/melee/ullapool_caber.png'),
                    '307': require('@/assets/icons/weapon_icons/demo/melee/ullapool_caber.png'),
                },
                'CTFMinigun': {
                    '0': require('@/assets/icons/weapon_icons/heavy/primary/minigun.png'),          
                    '15': require('@/assets/icons/weapon_icons/heavy/primary/minigun.png'),             
                    '41': require('@/assets/icons/weapon_icons/heavy/primary/natasha.png'),             
                    '298': require('@/assets/icons/weapon_icons/heavy/primary/iron_curtian.png'),      
                    '312': require('@/assets/icons/weapon_icons/heavy/primary/brass_beast.png'),      
                    '424': require('@/assets/icons/weapon_icons/heavy/primary/tomislav.png'),        
                    '811': require('@/assets/icons/weapon_icons/heavy/primary/huo_long_heater.png'),                    
                },
                'CTFLunchBox': {
                    '0': require('@/assets/icons/weapon_icons/heavy/secondary/sandvich.png'),          
                    '42': require('@/assets/icons/weapon_icons/heavy/secondary/sandvich.png'),       
                    '159': require('@/assets/icons/weapon_icons/heavy/secondary/dalokas_bar.png'),       
                    '311': require('@/assets/icons/weapon_icons/heavy/secondary/buffalo_steak.png'),       
                    '433': require('@/assets/icons/weapon_icons/heavy/secondary/fishcake.png'),          
                    '863': require('@/assets/icons/weapon_icons/heavy/secondary/robo_sandvich.png'),      
                    '1190': require('@/assets/icons/weapon_icons/heavy/secondary/second_banana.png'),       
                },
                'CTFFists': {
                    '0': require('@/assets/icons/weapon_icons/heavy/melee/fists.png'),     
                    '5': require('@/assets/icons/weapon_icons/heavy/melee/fists.png'),     
                    '43': require('@/assets/icons/weapon_icons/heavy/melee/killing_gloves_of_boxing.png'),     
                    '239': require('@/assets/icons/weapon_icons/heavy/melee/gloves_running.png'),        
                    '310': require('@/assets/icons/weapon_icons/heavy/melee/warriors_spirit.png'),     
                    '331': require('@/assets/icons/weapon_icons/heavy/melee/fists_of_steel.png'),      
                    '426': require('@/assets/icons/weapon_icons/heavy/melee/eviction_notice.png'),     
                    '587': require('@/assets/icons/weapon_icons/heavy/melee/apoco_fists.png'),      
                    '656': require('@/assets/icons/weapon_icons/heavy/melee/holiday_punch.png'),    
                    '1100': require('@/assets/icons/weapon_icons/heavy/melee/bread_bite.png'),     
                },
                'CTFSyringeGun': {
                    '0': require('@/assets/icons/weapon_icons/medic/primary/syringe_gun.png'),
                    '17': require('@/assets/icons/weapon_icons/medic/primary/syringe_gun.png'),
                    '36': require('@/assets/icons/weapon_icons/medic/primary/blutsauger.png'),
                    '412': require('@/assets/icons/weapon_icons/medic/primary/overdose.png'),
                },
                'CTFCrossbow': {
                    '0': require('@/assets/icons/weapon_icons/medic/primary/crusaders_crossbow.png'),
                    '305': require('@/assets/icons/weapon_icons/medic/primary/crusaders_crossbow.png'),
                },
                'CWeaponMedigun': {
                    '0': require('@/assets/icons/weapon_icons/medic/secondary/medi_gun.png'),
                    '35': require('@/assets/icons/weapon_icons/medic/secondary/kritzkrieg.png'),
                    '411': require('@/assets/icons/weapon_icons/medic/secondary/quick_fix.png'),
                    '998': require('@/assets/icons/weapon_icons/medic/secondary/vaccinator.png')
                },
                'CTFBonesaw': {
                    '0': require('@/assets/icons/weapon_icons/medic/melee/bonesaw.png'),
                    '8': require('@/assets/icons/weapon_icons/medic/melee/bonesaw.png'),
                    '37': require('@/assets/icons/weapon_icons/medic/melee/ubersaw.png'),
                    '173': require('@/assets/icons/weapon_icons/medic/melee/vita_saw.png'),
                    '304': require('@/assets/icons/weapon_icons/medic/melee/amputator.png'),
                    '413': require('@/assets/icons/weapon_icons/medic/melee/solumn_vow.png'),
                },
                'CTFShotgunBuildingRescue': {
                    '0': require('@/assets/icons/weapon_icons/engineer/primary/rescue_ranger.png'),
                    '997': require('@/assets/icons/weapon_icons/engineer/primary/rescue_ranger.png'),
                },
                'CTFShotgun_Revenge': {
                    '0': require('@/assets/icons/weapon_icons/engineer/primary/frontier_justice.png'),
                    '141': require('@/assets/icons/weapon_icons/engineer/primary/frontier_justice.png'),
                },
                'CTFDRGPomson': {
                    '0': require('@/assets/icons/weapon_icons/engineer/primary/pompson.png'),
                    '588': require('@/assets/icons/weapon_icons/engineer/primary/pompson.png'),
                },
                'CTFLaserPointer': {
                    '0': require('@/assets/icons/weapon_icons/engineer/secondary/giger_counter.png'),
                    '140': require('@/assets/icons/weapon_icons/engineer/secondary/giger_counter.png'),
                    '30668': require('@/assets/icons/weapon_icons/engineer/secondary/giger_counter.png'),
                },
                'CTFMechanicalArm': {
                    '0': require('@/assets/icons/weapon_icons/engineer/secondary/short_circuit.png'),
                    '528': require('@/assets/icons/weapon_icons/engineer/secondary/short_circuit.png'),
                },
                'CTFWrench': {
                    '0': require('@/assets/icons/weapon_icons/engineer/melee/wrench.png'),
                    '7': require('@/assets/icons/weapon_icons/engineer/melee/wrench.png'),
                    '155': require('@/assets/icons/weapon_icons/engineer/melee/southern_hospitality.png'),
                    '329': require('@/assets/icons/weapon_icons/engineer/melee/jag.png'),
                    '589': require('@/assets/icons/weapon_icons/engineer/melee/eureka_effect.png'),
                },
                'CTFRobotArm': {
                    '0': require('@/assets/icons/weapon_icons/engineer/melee/gunslinger.png'),
                    '142': require('@/assets/icons/weapon_icons/engineer/melee/gunslinger.png'),
                },
                'CTFWeaponPDA_Engineer_Build': {
                    '0': require('@/assets/icons/weapon_icons/engineer/pda/build_pda.png'),
                    '25': require('@/assets/icons/weapon_icons/engineer/pda/build_pda.png'),
                },
                'CTFWeaponPDA_Engineer_Destroy': {
                    '0': require('@/assets/icons/weapon_icons/engineer/pda/Destruction_pda.png'),
                    '26': require('@/assets/icons/weapon_icons/engineer/pda/Destruction_pda.png'),
                },
                'CTFSniperRifle': {
                    '0': require('@/assets/icons/weapon_icons/sniper/primary/sniper_rifle.png'),
                    '14': require('@/assets/icons/weapon_icons/sniper/primary/sniper_rifle.png'),
                    '230': require('@/assets/icons/weapon_icons/sniper/primary/sydney_sleeper.png'),
                    '526': require('@/assets/icons/weapon_icons/sniper/primary/machina.png'),
                    '752': require('@/assets/icons/weapon_icons/sniper/primary/hitmans_heatmaker.png'),
                    '851': require('@/assets/icons/weapon_icons/sniper/primary/awper_hand.png'),
                    '30665': require('@/assets/icons/weapon_icons/sniper/primary/shooting_star.png'),
                },
                'CTFSniperRifleClassic': {
                    '0': require('@/assets/icons/weapon_icons/sniper/primary/classic.png'),
                    '1098': require('@/assets/icons/weapon_icons/sniper/primary/classic.png'),
                },
                'CTFSniperRifleDecap': {
                    '0': require('@/assets/icons/weapon_icons/sniper/primary/bazzar_bargain.png'),
                    '402': require('@/assets/icons/weapon_icons/sniper/primary/bazzar_bargain.png'),
                },
                'CTFCompoundBow': {
                    '0': require('@/assets/icons/weapon_icons/sniper/primary/huntsman.png'),
                    '56': require('@/assets/icons/weapon_icons/sniper/primary/huntsman.png'),
                    '1092': require('@/assets/icons/weapon_icons/sniper/primary/fortified_compound.png'),
                },
                'CTFSMG': {
                    '0': require('@/assets/icons/weapon_icons/sniper/secondary/smg.png'),
                    '16': require('@/assets/icons/weapon_icons/sniper/secondary/smg.png'),
                },
                'CTFJar': {
                    '0': require('@/assets/icons/weapon_icons/sniper/secondary/jarate.png'),
                    '58': require('@/assets/icons/weapon_icons/sniper/secondary/jarate.png'),
                    '1105': require('@/assets/icons/weapon_icons/sniper/secondary/self_aware_beauty_mark.png'),
                },
                'CTFChargedSMG': {
                    '0': require('@/assets/icons/weapon_icons/sniper/secondary/cleaners_carbine.png'),
                    '751': require('@/assets/icons/weapon_icons/sniper/secondary/cleaners_carbine.png'),
                },
                'CTFClub': {
                    '0': require('@/assets/icons/weapon_icons/sniper/melee/kukri.png'),
                    '3': require('@/assets/icons/weapon_icons/sniper/melee/kukri.png'),
                    '171': require('@/assets/icons/weapon_icons/sniper/melee/tribalmans_shiv.png'),
                    '232': require('@/assets/icons/weapon_icons/sniper/melee/bushwacka.png'),
                    '401': require('@/assets/icons/weapon_icons/sniper/melee/shahanshah.png'),
                },
                'CTFRevolver': {
                    '0': require('@/assets/icons/weapon_icons/spy/secondary/revolver.png'),
                    '24': require('@/assets/icons/weapon_icons/spy/secondary/revolver.png'),
                    '61': require('@/assets/icons/weapon_icons/spy/secondary/ambassador.png'),
                    '161': require('@/assets/icons/weapon_icons/spy/secondary/big_kill.png'),
                    '224': require('@/assets/icons/weapon_icons/spy/secondary/letranger.png'),
                    '460': require('@/assets/icons/weapon_icons/spy/secondary/enforcer.png'),
                    '525': require('@/assets/icons/weapon_icons/spy/secondary/diamondback.png'),
                },
                'CTFWeaponBuilder': {
                    '0': require('@/assets/icons/weapon_icons/spy/building/sapper.png'),
                    '735': require('@/assets/icons/weapon_icons/spy/building/sapper.png'),
                },
                'CTFWeaponSapper': {
                    '0': require('@/assets/icons/weapon_icons/spy/building/sapper.png'),
                    '810': require('@/assets/icons/weapon_icons/spy/building/red_tape_recorder.png'),
                    '831': require('@/assets/icons/weapon_icons/spy/building/red_tape_recorder.png'),
                    '933': require('@/assets/icons/weapon_icons/spy/building/ap_sap.png'),
                    '1102': require('@/assets/icons/weapon_icons/spy/building/snack_attack.png'),
                },
                'CTFKnife': {
                    '0': require('@/assets/icons/weapon_icons/spy/melee/knife.png'),
                    '4': require('@/assets/icons/weapon_icons/spy/melee/knife.png'),
                    '225': require('@/assets/icons/weapon_icons/spy/melee/your_eternal_reward.png'),
                    '356': require('@/assets/icons/weapon_icons/spy/melee/connivers_kunai.png'),
                    '461': require('@/assets/icons/weapon_icons/spy/melee/big_earner.png'),
                    '574': require('@/assets/icons/weapon_icons/spy/melee/wanga_prick.png'),
                    '638': require('@/assets/icons/weapon_icons/spy/melee/sharp_dresser.png'),
                    '649': require('@/assets/icons/weapon_icons/spy/melee/spy_cicle.png'),
                    '727': require('@/assets/icons/weapon_icons/spy/melee/black_rose.png'),
                },
                'CTFWeaponPDA_Spy': {
                    '0': require('@/assets/icons/weapon_icons/spy/pda/disguise_kit.png'),
                    '27': require('@/assets/icons/weapon_icons/spy/pda/disguise_kit.png'),
                }
            },
            overhealIcon: require('@/assets/icons/status_effects/health-cross-buff.png'),
            redUberedIcon: require('@/assets/icons/status_effects/uber_red.png'),
            bluUberedIcon: require('@/assets/icons/status_effects/uber_blue.png'),
            makredForDeathIcon: require('@/assets/icons/status_effects/marked_for_death.png'),
            bleedingIcon: require('@/assets/icons/status_effects/bleed_drop.png'),
            ammoIcon: require('@/assets/icons/ammo.png'),
            controlPointIcons: {
                oneOnPoint: require('@/assets/icons/control_points/1s.png'),
                twoOnPoint: require('@/assets/icons/control_points/2s.png'),
                threeOnPoint: require('@/assets/icons/control_points/3s.png'),
                locked: require('@/assets/icons/control_points/rounded-lock.png'),
            },
            checkCache: true
        }
    },
    watch: {

    },
    sockets: {
        async data (data) {
            this.info = data
            
            if (this.checkCache) {
                for (let i in this.info.allplayers) {
                    try {
                        const steamid = i
                        const data = await this.$axios.get(`/player/${steamid}`)
                        this.playerCache[i] = data.data

                        if (this.playerCache[i])
                            this.info.allplayers[i].name = this.playerCache[i].name
                    } catch (error) {
                        console.log(error)
                    }
                }

                this.checkCache = false

                setTimeout(() => this.checkCache = true, 30000)
            }
        },

        config (data) {
            this.config = data
        }
    }
}
</script>

<style lang="less">
</style>
