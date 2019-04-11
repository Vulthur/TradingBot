 <template>
    <div id="strategys-main">
        <h2>Strategies</h2>
        <form id="form-strategy" @submit.prevent="addStrat">
            <div class="row">
                <label for="type">Type</label>
                <select required id="type" v-model="type">
                    <option v-for="type in types" v-bind:key="type">
                        {{ type }}
                    </option>
                </select>
            </div>
            <div class="row">
                <label for="name">Name</label>
                <input type="text" id="name" required v-model="name">
                <label for="pot">Pot</label>
                <input type="number" id="pot" min="0.1" step="any" required v-model.number="pot">
            </div>
            <div class="row">
                <label for="stopLoss">Stop Loss</label>
                <input type="number" id="stopLoss" min="0.1" step="any" required v-model.number="stopLoss">
                <label for="leverage">Leverage</label>
                <input type="number" id="leverage" min="1" required v-model.number="leverage">
            </div>
            <component ref="refComposantStrategy" v-bind:is="composantStrategy"></component>
            <div class="row">
                <button @click.prevent="newStrat">New</button>
                <button v-if="mode === 'new'" type="submit">Add</button>
                <button v-if="mode === 'modify'" @click.prevent="modifyStrat">Modifiy</button>
            </div>
        </form>
        <div class="error" v-if="error"> {{error}} </div>
        <div v-if="strategys.length" class="addedStarts">
            <div v-for="(strategy, index) in strategys" class="rowStrat" v-bind:key="index">
                <div @click="selectStrat(strategy)"
                        v-bind:class="currentStratIndex === index ? styleActiveStrat : styledNotActiveStrat"
                        class="addedStart row">
                    <span>{{ strategy.name }}</span> 
                    <span>{{ strategy.alias }}</span> 
                    <span>{{ (strategy.resultPot - strategy.pot).toFixed(2) }}</span>  
                    <span>{{ strategy.rentability.toFixed(2) }}%</span> 
                    <span>{{ strategy.successRate.toFixed(2) }}%</span>
                </div>
                <button class="buttonStrat" @click="deleteStrat(strategy)">&#10006;</button>
                <button class="buttonStrat" 
                        v-bind:class="hidedStrategy.indexOf(strategy) !== -1 ? 'hidedStratButton' : ''"
                        @click="hideStrat(strategy)">
                    &#128065;
                </button>
            </div>
        </div>
        <hr>
        <component 
            v-on:currentAction="currentAction"
            v-if="strategys.length"
            :strategy="strategys[currentStratIndex]" 
            ref="refActionComponent" 
            v-bind:is="composantAction">
        </component>
    </div>
</template>

<style scoped>
    #strategys-main {
        padding: 0 10px;
    }
    .styledNotActiveStrat {
        border: 1px solid #313131;
    }
    .styleActiveStrat {
        font-weight: bold;
        border: 1px double rgb(56, 128, 180);
    }
    .addedStarts {
        text-align: center;
        padding: 0px 0px 10px 0px;      
    }
    .rowStrat {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .rowStrat > * {
        margin: 1px 7px;
    }
    .addedStart {
        box-sizing: border-box;
        cursor: pointer;
        flex-grow: 15;
        flex-basis: 0;
        min-width: 0;
    }
    .buttonStrat {
        flex-grow: 1;
        flex-basis: 0;
        min-width: 0;
        text-align: center;
        font-size: 0.9vw;
        letter-spacing: 0;
    }
    .hidedStratButton {
        background: #313131;
    }
</style>

<script lang="ts">
    import Vue from "vue";

    import { Graph } from "../../../core/Graph";
    import { Strategy } from "../../../core/Strategy/Strategy";
    import { Action } from "../../../core/Action/Action";
    import { aliasBollinger} from "../../../core/Strategy/StrategyBollinger";
    import { aliasTest } from "../../../core/Strategy/StrategyTest";

    import StrategyBollingerComponent from "./StrategyBollinger.vue";
    import StrategyTestComponent from "./StrategyTest.vue";
    import ActionComponent from "../Action/Action.vue";

    let ListStrategysComponent: {[index: string] : Vue.VueConstructor} = {};
    ListStrategysComponent[aliasBollinger] = StrategyBollingerComponent;
    ListStrategysComponent[aliasTest] = StrategyTestComponent;

    // Interface references
    interface vueStartegy extends Vue {
        createStrategy(name: string, leverage: number, stopLoss: number, pot: number) : Strategy
        initStrategy(strategy: Strategy) : void
    }
    interface vueAction extends Vue {
        reset() : void,
    }

    export default Vue.extend({
        props : {
            // TODO waiting for commit PropTypes Vue JS
            strategys: Array as () => Array<Strategy>,
        },
        data() {
            return {
                types: Object.keys(ListStrategysComponent),
                error: "",
                type: "",
                mode: "new",
                pot: 0.2,
                leverage: 10,
                stopLoss: 0.1,
                name: "",
                currentStratIndex: -1,
                styleActiveStrat: 'styleActiveStrat',
                styledNotActiveStrat: 'styledNotActiveStrat',
                hidedStrategy: new Array<Strategy>(),
            }
        },
        methods: {
            newStrat(): void {
                this.type = "";   
                this.pot = 0.2;
                this.leverage = 10;
                this.stopLoss = 0.1;
                this.name = "";
                this.currentStratIndex = -1;
                this.mode = "new"
            },
            addStrat(): void {                
                let strategy: Strategy = (this.$refs.refComposantStrategy as vueStartegy)
                        .createStrategy(this.name, this.leverage, this.stopLoss, this.pot);

                this.currentStratIndex = this.strategys.push(strategy) - 1;
                this.mode = "modify"
                this.$nextTick(function() {
                    this.$emit('update:currentStrategy', strategy);
                });
            },
            modifyStrat(): void {
                let strategy: Strategy = (this.$refs.refComposantStrategy as vueStartegy)
                        .createStrategy(this.name, this.leverage, this.stopLoss, this.pot);
                
                let index = this.hidedStrategy.indexOf(this.strategys[this.currentStratIndex]);
                if(index !== -1){
                    this.hidedStrategy.splice(index, 1, strategy);
                    this.$emit('update:hidedStrategy', this.hidedStrategy);
                }

                this.strategys.splice(this.currentStratIndex, 1, strategy);

                this.$nextTick(function() {
                    this.$emit('update:currentStrategy', strategy);
                });
            },
            selectStrat(strategy: Strategy): void {
                let indexSelected = this.strategys.indexOf(strategy);
                if(indexSelected !== this.currentStratIndex){
                    this.$emit('update:currentStrategy', strategy);
                    this.currentStratIndex = indexSelected;
                    this.type = strategy.$alias;

                    // Async change, waiting for computed value to update
                    this.$nextTick(function() {
                        (this.$refs.refComposantStrategy as vueStartegy).initStrategy(strategy);
                    });
                    
                    this.pot = strategy.$pot;
                    this.leverage = strategy.$leverage;
                    this.stopLoss = strategy.$stopLoss;
                    this.name = strategy.$name;
                    this.mode = "modify";

                    (this.$refs.refActionComponent as vueAction).reset();
                }
            },
            deleteStrat(strategy: Strategy): void {
                let indexStrat = this.strategys.indexOf(strategy);
                this.strategys.splice(indexStrat, 1);
                if(indexStrat === this.currentStratIndex){
                    this.newStrat();
                } else {
                    this.currentStratIndex -= 1;
                }
                let index = this.hidedStrategy.indexOf(strategy);
                if(index !== -1){
                    this.hidedStrategy.splice(index, 1);
                    this.$emit('update:hidedStrategy', this.hidedStrategy);
                }
            },
            hideStrat(strategy: Strategy){
                let index = this.hidedStrategy.indexOf(strategy);
                if(index === -1){
                    this.hidedStrategy.push(strategy);
                } else {
                    this.hidedStrategy.splice(index, 1);
                }
            },
            insertStrats(){
                this.currentStratIndex = -1;
                this.hidedStrategy = [];
            },
            currentAction(action: Action){
                this.$emit("update:currentAction", action);
            }
        },
        components: {
            StrategyBollingerComponent,
            StrategyTestComponent,
            ActionComponent
        },
        computed: {
            composantStrategy: function() {       
                return ListStrategysComponent[this.type];
            },
            composantAction: function() {       
                return ActionComponent;
            }
        },
        watch: {
            strategys: {
                handler() {
                    if(this.$refs.refActionComponent)
                        (this.$refs.refActionComponent as vueAction).reset();
                }
            },
            hidedStrategy: {
                handler() {
                    this.$emit('update:hidedStrategy', this.hidedStrategy);
                    if(this.$refs.refActionComponent)
                        (this.$refs.refActionComponent as vueAction).reset();
                }
            },
        }
    });
</script>