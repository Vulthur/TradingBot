<template>
    <div id="loading-main"> 
        <div id="spinning">
            <span class="circle" id="circle-1"></span>
            <span class="circle" id="circle-2"></span>
            <span class="circle" id="circle-3"></span>
        </div>
    </div>
</template>

<style scoped>
    #loading-main {
        width: 100%;
        height: 100%;
        background-color: #0000004c;
        position: absolute;
    }
    .circle {
        height: 10px;
        width: 10px;
        background-color: #fcfcfc;
        display: inline-block;
        border-radius: 10px;
        position: absolute;
        margin-top: -5px;
        margin-left: -5px;
    }
    #spinning {
        height: 100px;
        width: 100px;
        position: relative;
        top: 50%;
        left: 50%;
        margin-top: -50px;
        margin-left: -50px;
        animation-duration: 3s;
        animation-name: animationSpinning;
        animation-iteration-count: infinite;
        animation-duration: 2s;
    }
    #circle-1{
        top: 40px;
        left: 50px;
        transform: rotate(90deg);
    }
    #circle-2{
        top: 60px;
        left: 38px;
        transform: rotate(135deg);
    }
    #circle-3{
        top: 60px;
        left: 62px;
        transform: rotate(45deg);
    }

    @keyframes animationSpinning {
        0% {
            transform: rotate(0deg) scale(1);
            animation-timing-function: ease-in;
        }
        50% {
            transform: rotate(180deg) scale(2);
            animation-timing-function: ease-out;
        }
        100% {
            transform: rotate(360deg) scale(1);
        }
    }
</style>

<script lang="ts">
    import Vue from "vue";
    import { Graph } from "../../core/Graph";
    
    export default Vue.extend({
        props: {
        },
        methods: {
        },
        data() {
            return {
            }
        },
    });
</script>