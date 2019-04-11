<template>
    <div id="bollinger-main">
        <div class="row">
            <label for="SMAlength">SMA Length</label>
            <input type="number" id="SMAlength" min="2" step="any" v-model.number="SMAlength">
        </div>
        <div class="row">
            <label for="factorStandardDeviation">Factor Standard Deviation</label>
            <input 
                min="0.01" 
                step="any"
                type="number"
                id="factorStandardDeviation" 
                v-model.number="factorStandardDeviation">
        </div>
        <div class="row">
            <label for="colorSma">Color SMA</label>
            <input type="color" id="color" required v-model="colorSMA">
            <label for="colorBands">Color Bands</label>
            <input type="color" id="color" required v-model="colorBB">
        </div>
        <div class="row">
        </div>
    </div>
</template>

<style scoped>
</style>

<script lang="ts">
    import Vue from "vue";
    import { Strategy } from "../../../core/Strategy/Strategy";
    import { StrategyBollinger } from "../../../core/Strategy/StrategyBollinger";
    import { Utils } from "../../../core/Utils";

    export default Vue.extend({
        methods: {
            createStrategy(name: string, leverage: number, stopLoss: number, pot: number) : Strategy {
                return new StrategyBollinger(name, leverage, stopLoss, pot,
                        this.SMAlength, this.factorStandardDeviation, 
                        Utils.convertFormColorToHexColor(this.colorSMA),
                        Utils.convertFormColorToHexColor(this.colorBB)
                );

            },
            initStrategy(strategy: StrategyBollinger){
                this.SMAlength = strategy.$SMAlength;
                this.factorStandardDeviation = strategy.$factorStandardDeviation;
                this.colorBB = Utils.convertHexColorToFormColor(strategy.$colorBB);
                this.colorSMA = Utils.convertHexColorToFormColor(strategy.$colorSMA);
            }
        },
        data() {
            return {
                error: "",
                SMAlength: 20,
                factorStandardDeviation: 0.5,
                colorSMA: "#FF00FF",
                colorBB: "#FF0000",
            }
        }
    });
</script>