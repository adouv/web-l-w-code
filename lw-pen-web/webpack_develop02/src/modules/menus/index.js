import MenuComponent from './views/menu';
import SubMenuComponent from './views/subMenu';
export default {
  name: "MenusComponent",
  components: {
    menuTemp: MenuComponent,
    subMenuTemp: SubMenuComponent
  },
  data() {
    return {
      winType: true,
      winWidth: 80,
      winHeight: 400,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      out: false
    };
  },
  mounted() {
    this.win$.setCurrentWindowPosition(this.availWidth - this.winWidth, this.availHeight - this.winHeight);
    this.receiveMenuType();
  },
  methods: {
    receiveMenuType() {
      let myThis = this;
      myThis.winHeight = this.winType ? 400 : 450;
      myThis.win$.setCurrentWindowSize(myThis.winWidth, myThis.winHeight);
      this.win$.receive('menuType', (event, args) => {
        myThis.winType = args;
        myThis.winHeight = args ? 400 : 450;
        myThis.win$.setCurrentWindowSize(myThis.winWidth, myThis.winHeight);
        myThis.win$.setCurrentWindowPosition(myThis.availWidth - myThis.winWidth, myThis.availHeight - myThis.winHeight);
      });
    }
  }
};
