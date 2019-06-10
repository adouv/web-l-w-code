<template>
  <div class="lw-page-intelligent-basic-monitoring">
    <table class="table">
      <thead>
        <tr>
          <th width="67">序号</th>
          <th width="64">名称</th>
          <th width="79">行为类型</th>
          <th width="146">参照标准</th>
          <th width="251">单次程度条件配置</th>
          <th width="252">持续性多次程度条件配置</th>
          <th width="206">通知提醒策略</th>
          <th width="155">处理反馈审批流程</th>
          <th width="96">是否启用</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>早到</td>
          <td>优常</td>
          <td>学校作息时间表</td>
          <td>
            <ul>
              <li>
                <span>优秀：</span>
                <span>早到10分钟以上；</span>
              </li>
              <li>
                <span>很好：</span>
                <span>早到5分钟以上；</span>
              </li>
              <li>
                <span>较好：</span>
                <span>早到2分钟以上；</span>
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li>
                <span>恶劣：</span>
                <span>连续迟到5周以上或累计迟到40次以上；</span>
              </li>
              <li>
                <span>很差：</span>
                <span>连续迟到3周以上或累计早到30次以上；</span>
              </li>
              <li>
                <span>不好：</span>
                <span>连续早到1周以上或累计早到10次以上；</span>
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li>1.持续不好、持续很差、持续恶劣时均微信通知到教师本人并提醒；</li>
              <li>2.持续不好、持续很差和持续恶劣时均微信通知到教务管理老师、直管领导和校长；</li>
            </ul>
          </td>
          <td>教务老师-审批-抄送教学直管领导和校长</td>
          <td>
            <a-switch defaultChecked/>
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>早到</td>
          <td>优常</td>
          <td>学校作息时间表</td>
          <td>
            <ul>
              <li>
                <span>优秀：</span>
                <span>早到10分钟以上；</span>
              </li>
              <li>
                <span>很好：</span>
                <span>早到5分钟以上；</span>
              </li>
              <li>
                <span>较好：</span>
                <span>早到2分钟以上；</span>
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li>
                <span>恶劣：</span>
                <span>连续迟到5周以上或累计迟到40次以上；</span>
              </li>
              <li>
                <span>很差：</span>
                <span>连续迟到3周以上或累计早到30次以上；</span>
              </li>
              <li>
                <span>不好：</span>
                <span>连续早到1周以上或累计早到10次以上；</span>
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li>1.持续不好、持续很差、持续恶劣时均微信通知到教师本人并提醒；</li>
              <li>2.持续不好、持续很差和持续恶劣时均微信通知到教务管理老师、直管领导和校长；</li>
            </ul>
          </td>
          <td>教务老师-审批-抄送教学直管领导和校长</td>
          <td>
            <a-switch defaultChecked/>
          </td>
        </tr>
        <tr>
          <td>3</td>
          <td>早到</td>
          <td>优常</td>
          <td>学校作息时间表</td>
          <td>
            <ul>
              <li>
                <span>优秀：</span>
                <span>早到10分钟以上；</span>
              </li>
              <li>
                <span>很好：</span>
                <span>早到5分钟以上；</span>
              </li>
              <li>
                <span>较好：</span>
                <span>早到2分钟以上；</span>
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li>
                <span>恶劣：</span>
                <span>连续迟到5周以上或累计迟到40次以上；</span>
              </li>
              <li>
                <span>很差：</span>
                <span>连续迟到3周以上或累计早到30次以上；</span>
              </li>
              <li>
                <span>不好：</span>
                <span>连续早到1周以上或累计早到10次以上；</span>
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li>1.持续不好、持续很差、持续恶劣时均微信通知到教师本人并提醒；</li>
              <li>2.持续不好、持续很差和持续恶劣时均微信通知到教务管理老师、直管领导和校长；</li>
            </ul>
          </td>
          <td>教务老师-审批-抄送教学直管领导和校长</td>
          <td>
            <a-switch defaultChecked/>
          </td>
        </tr>
        <tr>
          <td>4</td>
          <td>早到</td>
          <td>优常</td>
          <td>学校作息时间表</td>
          <td>
            <ul>
              <li>
                <span>优秀：</span>
                <span>早到10分钟以上；</span>
              </li>
              <li>
                <span>很好：</span>
                <span>早到5分钟以上；</span>
              </li>
              <li>
                <span>较好：</span>
                <span>早到2分钟以上；</span>
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li>
                <span>恶劣：</span>
                <span>连续迟到5周以上或累计迟到40次以上；</span>
              </li>
              <li>
                <span>很差：</span>
                <span>连续迟到3周以上或累计早到30次以上；</span>
              </li>
              <li>
                <span>不好：</span>
                <span>连续早到1周以上或累计早到10次以上；</span>
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li>1.持续不好、持续很差、持续恶劣时均微信通知到教师本人并提醒；</li>
              <li>2.持续不好、持续很差和持续恶劣时均微信通知到教务管理老师、直管领导和校长；</li>
            </ul>
          </td>
          <td>教务老师-审批-抄送教学直管领导和校长</td>
          <td>
            <a-switch defaultChecked/>
          </td>
        </tr>
        <tr>
          <td>5</td>
          <td>早到</td>
          <td>优常</td>
          <td>学校作息时间表</td>
          <td>
            <ul>
              <li>
                <span>优秀：</span>
                <span>早到10分钟以上；</span>
              </li>
              <li>
                <span>很好：</span>
                <span>早到5分钟以上；</span>
              </li>
              <li>
                <span>较好：</span>
                <span>早到2分钟以上；</span>
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li>
                <span>恶劣：</span>
                <span>连续迟到5周以上或累计迟到40次以上；</span>
              </li>
              <li>
                <span>很差：</span>
                <span>连续迟到3周以上或累计早到30次以上；</span>
              </li>
              <li>
                <span>不好：</span>
                <span>连续早到1周以上或累计早到10次以上；</span>
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li>1.持续不好、持续很差、持续恶劣时均微信通知到教师本人并提醒；</li>
              <li>2.持续不好、持续很差和持续恶劣时均微信通知到教务管理老师、直管领导和校长；</li>
            </ul>
          </td>
          <td>教务老师-审批-抄送教学直管领导和校长</td>
          <td>
            <a-switch defaultChecked/>
          </td>
        </tr>
        <tr>
          <td>6</td>
          <td>早到</td>
          <td>优常</td>
          <td>学校作息时间表</td>
          <td>
            <ul>
              <li>
                <span>优秀：</span>
                <span>早到10分钟以上；</span>
              </li>
              <li>
                <span>很好：</span>
                <span>早到5分钟以上；</span>
              </li>
              <li>
                <span>较好：</span>
                <span>早到2分钟以上；</span>
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li>
                <span>恶劣：</span>
                <span>连续迟到5周以上或累计迟到40次以上；</span>
              </li>
              <li>
                <span>很差：</span>
                <span>连续迟到3周以上或累计早到30次以上；</span>
              </li>
              <li>
                <span>不好：</span>
                <span>连续早到1周以上或累计早到10次以上；</span>
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li>1.持续不好、持续很差、持续恶劣时均微信通知到教师本人并提醒；</li>
              <li>2.持续不好、持续很差和持续恶劣时均微信通知到教务管理老师、直管领导和校长；</li>
            </ul>
          </td>
          <td>教务老师-审批-抄送教学直管领导和校长</td>
          <td>
            <a-switch defaultChecked/>
          </td>
        </tr>
        <tr>
          <td>7</td>
          <td>早到</td>
          <td>优常</td>
          <td>学校作息时间表</td>
          <td>
            <ul>
              <li>
                <span>优秀：</span>
                <span>早到10分钟以上；</span>
              </li>
              <li>
                <span>很好：</span>
                <span>早到5分钟以上；</span>
              </li>
              <li>
                <span>较好：</span>
                <span>早到2分钟以上；</span>
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li>
                <span>恶劣：</span>
                <span>连续迟到5周以上或累计迟到40次以上；</span>
              </li>
              <li>
                <span>很差：</span>
                <span>连续迟到3周以上或累计早到30次以上；</span>
              </li>
              <li>
                <span>不好：</span>
                <span>连续早到1周以上或累计早到10次以上；</span>
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li>1.持续不好、持续很差、持续恶劣时均微信通知到教师本人并提醒；</li>
              <li>2.持续不好、持续很差和持续恶劣时均微信通知到教务管理老师、直管领导和校长；</li>
            </ul>
          </td>
          <td>教务老师-审批-抄送教学直管领导和校长</td>
          <td>
            <a-switch defaultChecked/>
          </td>
        </tr>
        <tr>
          <td>8</td>
          <td>早到</td>
          <td>优常</td>
          <td>学校作息时间表</td>
          <td>
            <ul>
              <li>
                <span>优秀：</span>
                <span>早到10分钟以上；</span>
              </li>
              <li>
                <span>很好：</span>
                <span>早到5分钟以上；</span>
              </li>
              <li>
                <span>较好：</span>
                <span>早到2分钟以上；</span>
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li>
                <span>恶劣：</span>
                <span>连续迟到5周以上或累计迟到40次以上；</span>
              </li>
              <li>
                <span>很差：</span>
                <span>连续迟到3周以上或累计早到30次以上；</span>
              </li>
              <li>
                <span>不好：</span>
                <span>连续早到1周以上或累计早到10次以上；</span>
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li>1.持续不好、持续很差、持续恶劣时均微信通知到教师本人并提醒；</li>
              <li>2.持续不好、持续很差和持续恶劣时均微信通知到教务管理老师、直管领导和校长；</li>
            </ul>
          </td>
          <td>教务老师-审批-抄送教学直管领导和校长</td>
          <td>
            <a-switch defaultChecked/>
          </td>
        </tr>
        <tr>
          <td>9</td>
          <td>早到</td>
          <td>优常</td>
          <td>学校作息时间表</td>
          <td>
            <ul>
              <li>
                <span>优秀：</span>
                <span>早到10分钟以上；</span>
              </li>
              <li>
                <span>很好：</span>
                <span>早到5分钟以上；</span>
              </li>
              <li>
                <span>较好：</span>
                <span>早到2分钟以上；</span>
              </li>
            </ul>
            <div class="setting-box">配置</div>
          </td>
          <td>
            <ul>
              <li>
                <span>恶劣：</span>
                <span>连续迟到5周以上或累计迟到40次以上；</span>
              </li>
              <li>
                <span>很差：</span>
                <span>连续迟到3周以上或累计早到30次以上；</span>
              </li>
              <li>
                <span>不好：</span>
                <span>连续早到1周以上或累计早到10次以上；</span>
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li>1.持续不好、持续很差、持续恶劣时均微信通知到教师本人并提醒；</li>
              <li>2.持续不好、持续很差和持续恶劣时均微信通知到教务管理老师、直管领导和校长；</li>
            </ul>
          </td>
          <td>教务老师-审批-抄送教学直管领导和校长</td>
          <td>
            <a-switch defaultChecked/>
          </td>
        </tr>
        <tr>
          <td>10</td>
          <td>早到</td>
          <td>优常</td>
          <td>学校作息时间表</td>
          <td>
            <ul>
              <li>
                <span>优秀：</span>
                <span>早到10分钟以上；</span>
              </li>
              <li>
                <span>很好：</span>
                <span>早到5分钟以上；</span>
              </li>
              <li>
                <span>较好：</span>
                <span>早到2分钟以上；</span>
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li>
                <span>恶劣：</span>
                <span>连续迟到5周以上或累计迟到40次以上；</span>
              </li>
              <li>
                <span>很差：</span>
                <span>连续迟到3周以上或累计早到30次以上；</span>
              </li>
              <li>
                <span>不好：</span>
                <span>连续早到1周以上或累计早到10次以上；</span>
              </li>
            </ul>
          </td>
          <td>
            <ul>
              <li>1.持续不好、持续很差、持续恶劣时均微信通知到教师本人并提醒；</li>
              <li>2.持续不好、持续很差和持续恶劣时均微信通知到教务管理老师、直管领导和校长；</li>
            </ul>
          </td>
          <td>教务老师-审批-抄送教学直管领导和校长</td>
          <td>
            <a-switch defaultChecked/>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "LwPageIntelligentBasicMonitoring",
  data() {
    return {};
  },
  methods: {
    changeActive($event) {
      console.log($event.currentTarget);
      $event.currentTarget.querySelector("ul").classList.add("off");
      $event.currentTarget.querySelector("div").classList.add("on");
    },
    removeActive($event) {
      // $event.currentTarget.querySelector("ul").classList.add("on");
      // $event.currentTarget.querySelector("div").classList.add("off");
    }
  }
};
</script>

<style lang="scss">
@import "../../../assets/scss/_ddd/variable.style.scss";
.lw-page-intelligent-basic-monitoring {
  .off {
    display: none;
  }
  .on {
    display: block;
  }
  .table {
    width: 100%;
    border: computer(1px) solid #ddd;
    thead {
      height: computer(43px);
      line-height: computer(43px);
      text-align: center;
      th {
        border: computer(1px) solid #ddd;
        font-size: computer(14px);
        color: #999;
      }
    }
    tbody {
      text-align: center;
      td {
        border: computer(1px) solid #ddd;
        font-size: computer(14px);
        &:nth-child(5),
        &:nth-child(6),
        &:nth-child(7),
        &:nth-child(8) {
          text-align: left;
          padding: 0 computer(20px);
        }
        &:nth-child(7) {
          padding: computer(10px) computer(20px);
        }
        ul {
          li {
            display: flex;
            span {
              width: computer(45px);
              &:last-child {
                flex: 1;
              }
            }
          }
        }
        .setting-box {
          display: none;
          border:1px solid #f00;
        }
      }
    }
  }
}
</style>
