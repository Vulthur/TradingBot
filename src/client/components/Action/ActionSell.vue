<template>
    <span id="action-sell-main">
        <span> {{ utils.round(action.factor) }} </span>
        <span> {{ action.isWin ? "Win" : "Loss" }} </span>
    </span>
</template>

<style>
</style>

<script lang="ts">
    import Vue from "vue";
    import { ActionSell } from "../../../core/Action/ActionSell";
    import { Utils } from "../../../core/Utils";

    export default Vue.extend({
        props: {
            action: {} as () => ActionSell,
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