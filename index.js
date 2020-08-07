//Vue.config.devtools = true;

Vue.component('simon-quarter', {
  props: {
    quarter: Object,
    isEnabled: Boolean,
    options: String,
  },
  data: function() {
    return {
      isActive: false
    }
  },
  methods: {
    play: function() {
      let audio = new Audio(this.quarter.sound);
      if (this.options != "soundOff") {
        audio.play();
      }
      if (this.options != "lightOff") {
        this.isActive = true;
        setTimeout(() => {
          this.isActive = false;
        }, 250)
      }
    },
    clickHandler: function() {
      if (!this.isEnabled) return;
      this.play();
      this.$emit('user-click', this.quarter.name);
    }
  },
  template:`
    <div class = "circle__quarter"
      :class = "{ 'circle__quarter_active': isActive }"
      @click = "clickHandler"
    ></div>
  `
})

var app = new Vue({
  el: '#app',
  data: {
    stuff: [
      {name: 'quart1', sound: 'sounds/1.mp3'},
      {name: 'quart2', sound: 'sounds/2.mp3'},
      {name: 'quart3', sound: 'sounds/3.mp3'},
      {name: 'quart4', sound: 'sounds/4.mp3'},
    ],
    state: [],
    userSequence: [],
    round: 1,
    maxRound: 1,
    allowInput: false,
    interval: 400,
    options: 'normal',
    lose: false,
    freeBoard: false,
  },
  
  methods: {
    playQuarter: function(quarter) {
      this.$refs[quarter][0].play()
    },
    addStep: function() {
      this.state.push(this.stuff[Math.floor(Math.random()*4)].name)
    },
    playSequence: function() {
      this.newGame = false;
      this.allowInput = false;
      let i = 0;
      let timerID = setInterval(() => {
        this.playQuarter(this.state[i++]);
      }, this.interval);
      setTimeout(() => {
        clearInterval(timerID);
        this.allowInput = true;
      }, this.interval*this.state.length + this.interval/2);
    },
    userInputHandle: function(event) {
      if (this.freeBoard) return;
      if (!this.allowInput) return;
      this.userSequence.push(event);
      this.userSequence.map((val, index) => {
        if(val != this.state[index]) this.loseGame();
      });
      if (this.state.length === this.userSequence.length && this.state.length != 0) this.winRound()
    },
    loseGame: function() {
      this.lose = true;
      this.state = [];
      this.userSequence = [];
      this.round = 1;
      this.allowInput = false;
    },
    winRound: function() {
      this.round++;
      if (this.round > this.maxRound) this.maxRound = this.round;
      this.userSequence = [];
      this.addStep();
      this.allowInput = false;
      setTimeout(this.playSequence, 1500);
    },
    startGame: function() {
      if (this.freeBoard) {
        this.allowInput = true;
        return;
      }
      this.round = 0;
      this.state = [];
      this.lose = false;
      this.winRound();
    }
  },  
})


