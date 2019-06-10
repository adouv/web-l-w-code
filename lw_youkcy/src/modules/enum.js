//主菜单
export const parkBindMenuList = [{
    key: 0,
    label: "未绑定应用园区设备列表",
    show: false,
    url: 'parkBind',
    explain: `<p>设备绑定学校前的准备操作说明：</p>
    <p>1、将公司开户无线AP按照要开户的智写笔设备批次对应的开户网络配置信息进行正确的SSID和PW配置；</p>
    <p>2、接通公司开户无线AP电源；</p>
    <p>3、将无线AP成功连接至互联网；</p>
    <p>4、将需要开户的智写笔设备正常开机并成功连接至公司开户无线AP</p>`
  },
  {
    key: 1,
    label: "应用园区开户AP信息列表",
    show: false,
    url: 'applicationAP',
    explain: `<p>园区开户AP信息”相关说明：</p>
    <p>1、园区开户AP信息是为每个园区的开户AP指定了相应专属SSID和PW信息；</p>
    <p>2、园区运维管理员在进行智写笔设备开户时，其园区开户AP的SSID和PW信息必须配置为该信息才能成功将智写笔设备连接至平台；</p>
    <p>3、每个园区有且只有一个专属的开户AP信息；</p>
    <p>4、园区AP开户信息由系统内部根据规则自动生成，不可更改和编辑</p>`
  },
  {
    key: 2,
    label: "已绑定应用园区设备列表",
    show: false,
    url: 'bound',
    explain: `<p>设备解绑和禁用的区别说明：</p>
    <p>1、设备解绑是指将该设备的所有已绑定的应用园区解绑，且同时将设备上的其他所有信息全部恢复为出厂设置；解绑后的智写笔设备可以重新进行应用园区绑定操作。</p>
    <p>2、设备禁用是指该设备暂时停用，禁用后该设备能正常联网和显示学生信息，但不能正常使用。设备启用后该设备可恢复正常使用。</p>
    <p>3、设备禁用操作可逆，设备解绑操作不可逆。</p>`
  }
];
export const penDeviceMenuList = [{
    key: 0,
    label: "已开户学生设备",
    show: false,
    url: 'deviceManage',
    explain: ''
  },
  {
    key: 1,
    label: "已开户教师设备",
    show: false,
    url: '',
    explain: ''
  },
  {
    key: 2,
    label: "已挂失设备",
    show: false,
    url: '',
    explain: ''
  },
  {
    key: 3,
    label: "已注销设备",
    show: false,
    url: '',
    explain: ''
  }
];

export const accountOpenMenuList = [{
    key: 0,
    label: "当前未开户设备列表",
    show: false,
    url: 'accountOpen',
    explain: `<p>设备开户操作前的准备说明：</p>
  <p>1、将开户无线AP按照要开户的智写笔设备批次对应的开户配置信息进行正确的SSID和PW配置且接通电源并成功连接至互联网。</p>
  <p>2、将要进行开户的所有智写笔设备正常开机并成功连接至开户无线AP。</p>`
  },
  {
    key: 1,
    label: "班级教室智写笔AP配置",
    show: false,
    url: 'classAPInfo',
    explain: `<p>设备开户操作前的准备说明：</p>
  <p>1、将开户无线AP按照要开户的智写笔设备批次对应的开户配置信息进行正确的SSID和PW配置且接通电源并成功连接至互联网。</p>
  <p>2、将要进行开户的所有智写笔设备正常开机并成功连接至开户无线AP。</p>`
  },
  {
    key: 2,
    label: "教室专用智写笔AP配置",
    show: false,
    url: '',
    explain: `<p>设备开户操作前的准备说明：</p>
  <p>1、将开户无线AP按照要开户的智写笔设备批次对应的开户配置信息进行正确的SSID和PW配置且接通电源并成功连接至互联网。</p>
  <p>2、将要进行开户的所有智写笔设备正常开机并成功连接至开户无线AP。</p>`
  }
];
