<template>
    <span id="action-buy-main">
        <span> {{ utils.round(action.stopLoss) }} </span>
        <span v-bind:class="action.isUpTrend ? 'up' : 'down'"> 
            {{ action.isUpTrend ? "Long" : "Short" }} 
        </span>
    </span>
</template>

<style scoped>
    .up {
        color: #00FF00
    }
    .down {
        color: #FF0000
    }
</style>

<script lang="ts">
    import Vue from "vue";
    import { ActionBuy } from "../../../core/Action/ActionBuy";
    import { Utils } from "../../../core/Utils";

    export default Vue.extend({
        props: {
            action: {} as () => ActionBuy,
        },
        methods: {
        },
        components: {
        },
        data() {
            return {
                utils: Utils
            }
        }
    });
</script>