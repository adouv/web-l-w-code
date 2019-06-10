import { mapGetters, mapState, mapMutations, mapActions } from "vuex";
import OrganizationService from '../../../../_service/organization.service'
import AccountService from '../../../../_service/account.service'
import SelectPersonService from '../../../../_service/selectPerson.service'
import { isDate } from "util";
export default {
  name: "AddStudentComponent",
  data() {
    return {
      gardenLength: 1,
      gardenId: null,
      dataList: [],
      treeData: [],
      classId: '',
      selectedData: [],
      copySelectedData: [], //用于查询
      selectTreeData: [], //渲染数据,
      e: {}
    };
  },
  mounted() {
    this.gardenId = AccountService.getGardenId();
    this.classId = this.$route.query.classId;
    this.getDepartemntAccount();
  },
  methods: {
    close() {
      this.$router.push({
        name: 'studentList',
        query: { classId: this.classId }
      })
    },
    saveClick() {
      let selectedIds = [];
      this.onList.forEach(element => {
        selectedIds.push(element.id);
      });
      const params = {
        classId: this.classId,
        accountIds: selectedIds.join(",")
      };
      OrganizationService.addOrganizationAccount(params).then(res => {
        this.close();
      });
    },
    getCheckedKeys(args) {
      this.clearOnListAsyn();
      args.key.forEach(element => {
        const item = this.dataList.filter((v, i, a) => { return (v.id === element) })[0];
        item.category = args.category;
        if (item.isLeaf === true) {
          this.onListAsyn(item);
        }
      });
    },
    /**
     * 接口获取园区数据
     */
    getDepartemntAccount() {
      OrganizationService.getDepartemntAccountList(this.gardenId).then(res => {
        this.dataList = res;
        this.treeData = SelectPersonService.getTree(res, 'd_parent', 'id', 'pId');
      })
    },

    ...mapActions(["onListAsyn", "clearOnListAsyn"])
  },
  computed: {
    ...mapGetters(["onList"])
  }
};
