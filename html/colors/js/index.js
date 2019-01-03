var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/14ny2oB7g5Tof9TmKiaaDFv25XSCRt-LlBRJhIDz_3Mo/pubhtml?gid=40578722';

let timer;

function getColors(data, tabletop) {
  let map = {};
  data.forEach(function(entry){
    map[entry.name] = entry.hex;
  });
  let nc = nearestColor.from(map);
  let buntName = new Vue({
    el: '.js-app',
    data: {
      rotation: 180,
      currentColor: {
        value: '#ffffff', 
        name: 'white',
        nameValue: '#ffffff',
        contrastValue: '#000000',
      }
    },
    methods: {
      update: function(e, val){
        const v = val || e.target.value;
        
        if( !tinycolor(v).isValid() ){
          return;
        }
        
        let c = nc(v); 
        this.currentColor.name = c['name'];
        this.currentColor.nameValue = c['value'];
       
        this.currentColor.value = v;
        
        clearTimeout(timer);
        timer = setTimeout(() => { window.location.hash = v }, 500);
        
        let complement = tinycolor(v).complement();
        this.currentColor.contrastValue = tinycolor.mostReadable(v, [
          complement.toHexString(),
          complement.saturate(20).toHexString(),
          complement.saturate(30).toHexString(),
          complement.brighten(20).toHexString(),
          complement.brighten(30).toHexString(),
          complement.darken(20).toHexString(),
          complement.darken(30).toHexString(),
          complement.lighten(20).toHexString(),
          complement.lighten(30).toHexString(),
          complement.desaturate(20).toHexString(),
          complement.desaturate(30).toHexString(),
        ],{
          includeFallbackColors:true,
          level:"A",
          size:"small"
        }).toHexString()

      }
    },
    ready: function(){
      
      if ( !Modernizr.inputtypes.color ) {
        const $c = document.querySelector("input[type='color']");
        $c.classList.add("{hash:true}");
        $c.setAttribute("onchange", "up(this.jscolor)");
        $c.setAttribute("type", "button");
        var picker = new jscolor($c);
        window.up = (e) => { 
          let val = tinycolor($c.style['background-color']).toHexString();
          this.update(e, val)
        }
      }
      
      const hash = window.location && window.location.hash;
      
      if (hash) {
        this.update(null, hash);
      } else {
        this.update(null, '#'+Math.floor(Math.random()*16777215).toString(16));
      }
      
      setTimeout(() => {
        this.$el.classList.remove('is-hidden');
      },10);
      
      setTimeout(() => {
        document.querySelector('input[type="text"]').focus();
      },2000);
    },
  }); 
}

Tabletop.init( { key: public_spreadsheet_url, callback: getColors, simpleSheet: true } )