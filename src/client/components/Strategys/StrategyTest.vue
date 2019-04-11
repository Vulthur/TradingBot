<template>
    <div id="test-main">
        <div class="row">
            <label for="Test">Test</label>
            <input type="text" id="Test" v-model="test">
        </div>
    </div>
</template>

<style scoped>
</style>

<script lang="ts">
    import Vue from "vue";
    import { Strategy } from "../../../core/Strategy/Strategy";
    import { StrategyTest } from "../../../core/Strategy/StrategyTest";

    export default Vue.extend({
        methods: {
            createStrategy(name: string, leverage: number, stopLoss: number, pot: number) : Strategy {
                return new StrategyTest(name, leverage, stopLoss, pot, this.test);
            },
            initStrategy(strategy: StrategyTest){
                this.test = strategy.$test;
            }
        },
        components: {
        },
        data() {
            return {
                test: "test",
            }
        }
    });
</script>