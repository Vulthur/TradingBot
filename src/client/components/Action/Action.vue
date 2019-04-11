<template>
    <div id="action-main">
        <div v-if="strategy" id="action-list">
            <div class="rowAction" id="rowHeader">
                <span>Name</span> 
                <span>Date</span> 
                <span>Price</span>
                <span>Factor/SL</span>
            </div>
            <div v-for="(action, index) in strategy.actions" v-bind:key="index"
                    @click="currentAction(action)"
                    class="rowAction"
                    v-bind:class="currentActionIndex === index ? styleActiveAction : styleNotActiveAction">
                <span>{{ action.name }}</span> 
                <span>{{ utils.dateToString(action.date) }}</span> 
                <span>{{ action.price }}</span>
                <component 
                    class="typeAction"
                    :action="action"
                    v-bind:is="getActionTypeVue(action)">
                </component>
            </div>
        </div>
    </div>
</template>

<style>
    #action-main {
        padding: 10px 10px;
    }
    #action-list {
        width: 100%;
        font-size: 12px;
        cursor: pointer;
        border: 1px solid #313131;
    }
    #rowHeader {
        padding: 2px 4px;
        font-size: 14px;
        font-weight: bold;
    }
    .rowAction {
        display: flex;
        justify-content: space-between;
        padding: 0 4px;
        word-break: break-all;
    }
    .rowAction:nth-of-type(odd) {
        background: #313131;
    }
    .rowAction > span:not(:first-child){
        flex-grow: 2;
        flex-basis: 0; 
        min-width: 0;
    }
    .rowAction > span:first-child{
        flex-grow: 1;
        flex-basis: 0; 
        min-width: 0;
    }
    .styleActiveAction {
        border: 1px solid #3880b4;
    }
    .styleNotActiveAction {
        border: 1px solid transparent;
    }
</style>

<script lang="ts">
    import Vue from "vue";
    import ActionSellComponent from "./ActionSell.vue";
    import ActionBuyComponent from "./ActionBuy.vue";
    import { Strategy } from "../../../core/Strategy/Strategy";
    import { Action } from "../../../core/Action/Action";
    import { ActionBuy } from "../../../core/Action/ActionBuy";
    import { ActionSell } from "../../../core/Action/ActionSell";
    import { Utils } from "../../../core/Utils";
    
    export default Vue.extend({
        props: {
            // TODO waiting for commit PropTypes Vue JS
            strategy: Object as () => Strategy
        },
        methods: {
            currentAction(action: Action) {
                let index = this.strategy.$actions.indexOf(action);
                if(this.currentActionIndex !== index){
                    this.$emit("currentAction", action);
                    this.currentActionIndex = index;
                } else {
                    this.$emit("currentAction", null);
                    this.currentActionIndex = -1;
                }
            },
            getActionTypeVue(action: Action): Vue.VueConstructor{
                if(action instanceof ActionBuy){
                    return(ActionBuyComponent);
                } else {
                    return(ActionSellComponent);
                }
            },
            reset() {
                this.$emit("currentAction", null);
                this.currentActionIndex = -1;
            }
        },
        components: {
            ActionSellComponent,
            ActionBuyComponent,
        },
        data() {
            return {
                utils: Utils,
                currentActionIndex: -1,
                styleActiveAction: "styleActiveAction",
                styleNotActiveAction: "styleNotActiveAction",
            }
        },
        computed: {
        }
    });
</script>