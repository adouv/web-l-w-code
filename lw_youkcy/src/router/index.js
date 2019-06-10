import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../modules/shared/index'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [{
        path: '/login',
        name: 'login',
        meta: {
            title: "用户登录"
        },
        component: () =>
            import ('@/modules/login/index')
    },
    {
        path: '/404',
        name: '404',
        meta: {
            title: '404'
        },
        component: () =>
            import ('@/modules/404')
    },
    {
        path: '/entrance',
        name: 'entrance',
        meta: {
            title: "选择平台"
        },
        component: () =>
            import ('@/modules/doors/index')
    },
    {
        path: '/',
        name: 'dashboard',
        redirect: '/entrance',
        component: Layout,
        children: [{
                path: 'dashboard',
                name: 'dashboard',
                meta: {
                    title: "桌面"
                },
                component: () =>
                    import ('@/modules/dashboard/index')
            },
            {
                path: '/parkBind',
                name: 'parkBind',
                meta: {
                    title: '园区绑定'
                },
                component: () =>
                    import ('@/modules/parkBind/index')
            },
            {
                path: '/student',
                name: 'student',
                meta: {
                    title: "学生管理"
                },
                component: () =>
                    import ('@/modules/student/index'),
            },
            {
                path: '/studentAdd',
                name: 'studentAdd',
                meta: {
                    title: "学生添加"
                },
                component: () =>
                    import ('@/modules/student/add/index'),
            },
            {
                path: '/applicationAP',
                name: 'applicationAP',
                meta: {
                    title: "应用园区开户AP信息"
                },
                component: () =>
                    import ('@/modules/parkBind/applicationAP/index'),
            },
            {
                path: '/bound',
                name: 'bound',
                meta: {
                    title: "已绑定应用园区"
                },
                component: () =>
                    import ('@/modules/parkBind/bound/index'),
            }, {
                path: '/year',
                name: 'schoolYear',
                meta: {
                    title: "学年管理"
                },
                component: () =>
                    import ('@/modules/year/index'),
            },
            {
                path: '/yearAdd',
                name: 'schoolYearAdd',
                meta: {
                    title: "学年添加"
                },
                component: () =>
                    import ('@/modules/year/add/index'),
            }, {
                path: '/parent',
                name: 'parent',
                meta: {
                    title: "家长管理"
                },
                component: () =>
                    import ('@/modules/parent/index'),
            },
            {
                path: '/parentAdd',
                name: 'parentAdd',
                meta: {
                    title: "家长添加"
                },
                component: () =>
                    import ('@/modules/parent/add/index'),
            },
            {
                path: '/parentSelectChild',
                name: 'parentSelectChild',
                meta: {
                    title: "家长绑定学生"
                },
                component: () =>
                    import ('@/modules/parent/select/index'),
            },
            {
                path: '/park',
                name: 'park',
                meta: {
                    title: "应用园区"
                },
                component: () =>
                    import ('@/modules/parkBind/park/index'),
            },
            {
                path: '/deviceManage',
                name: 'deviceManage',
                meta: {
                    title: "设备管理"
                },
                component: () =>
                    import ('@/modules/deviceManage/index'),
            },
            {
                path: '/accountOpen',
                name: 'accountOpen',
                meta: {
                    title: "设备开户"
                },
                component: () =>
                    import ('@/modules/accountOpen/index'),
            },
            {
                path: '/studentOpen',
                name: 'studentOpen',
                meta: {
                    title: "学生开户"
                },
                component: () =>
                    import ('@/modules/accountOpen/student/index'),
            },
            {
                path: '/classAPInfo',
                name: 'classAPInfo',
                meta: {
                    title: "班级教室智写笔AP配置"
                },
                component: () =>
                    import ('@/modules/accountOpen/classAPInfo/index'),
            },
            {
                path: '/teacherList',
                name: 'teacherList',
                meta: {
                    title: "教职工名单"
                },
                component: () =>
                    import ('@/modules/teacher/index')
            },
            {
                path: 'editTeacher',
                name: 'editTeacher',
                meta: {
                    title: "编辑教职工信息"
                },
                component: () =>
                    import ('@/modules/teacher/edit/index')
            },
            {
                path: 'addTeacher',
                name: 'addTeacher',
                meta: {
                    title: "添加教职工信息"
                },
                component: () =>
                    import ('@/modules/teacher/add/index')
            },
            {
                path: 'setTeacher',
                name: 'setTeacher',
                meta: {
                    title: "设置教职工人脸比对ID"
                },
                component: () =>
                    import ('@/modules/teacher/set/index')
            },
            {
                path: 'checkTeacher',
                name: 'checkTeacher',
                meta: {
                    title: "查看教职工信息"
                },
                component: () =>
                    import ('@/modules/teacher/check/index')
            }
        ]
    }
];
// export const constantRouterMap = [{
//         path: '/login',
//         component: () =>
//             import ('@/modules/login/index'),
//         hidden: true
//     },
//     {
//         path: '/404',
//         component: () =>
//             import ('@/modules/404'),
//         hidden: true
//     },
//     {
//         path: '/',
//         component: Layout,
//         redirect: '/dashboard',
//         name: 'Dashboard',
//         hidden: true,
//         children: [{
//             path: 'dashboard',
//             component: () =>
//                 import ('@/modules/dashboard/index')
//         }]
//     },
//     {
//         path: '/form',
//         component: Layout,
//         children: [{
//             path: 'index',
//             name: 'Form',
//             component: () =>
//                 import ('@/views/form/index'),
//             meta: { title: 'Form', icon: 'form' }
//         }]
//     },
//     {
//         path: '/nested',
//         component: Layout,
//         redirect: '/nested/menu1',
//         name: 'Nested',
//         meta: {
//             title: 'Nested',
//             icon: 'nested'
//         },
//         children: [{
//                 path: 'menu1',
//                 component: () =>
//                     import ('@/views/nested/menu1/index'), // Parent router-view
//                 name: 'Menu1',
//                 meta: { title: 'Menu1' },
//                 children: [{
//                         path: 'menu1-1',
//                         component: () =>
//                             import ('@/views/nested/menu1/menu1-1'),
//                         name: 'Menu1-1',
//                         meta: { title: 'Menu1-1' }
//                     },
//                     {
//                         path: 'menu1-2',
//                         component: () =>
//                             import ('@/views/nested/menu1/menu1-2'),
//                         name: 'Menu1-2',
//                         meta: { title: 'Menu1-2' },
//                         children: [{
//                                 path: 'menu1-2-1',
//                                 component: () =>
//                                     import ('@/views/nested/menu1/menu1-2/menu1-2-1'),
//                                 name: 'Menu1-2-1',
//                                 meta: { title: 'Menu1-2-1' }
//                             },
//                             {
//                                 path: 'menu1-2-2',
//                                 component: () =>
//                                     import ('@/views/nested/menu1/menu1-2/menu1-2-2'),
//                                 name: 'Menu1-2-2',
//                                 meta: { title: 'Menu1-2-2' }
//                             }
//                         ]
//                     },
//                     {
//                         path: 'menu1-3',
//                         component: () =>
//                             import ('@/views/nested/menu1/menu1-3'),
//                         name: 'Menu1-3',
//                         meta: { title: 'Menu1-3' }
//                     }
//                 ]
//             },
//             {
//                 path: 'menu2',
//                 component: () =>
//                     import ('@/views/nested/menu2/index'),
//                 meta: { title: 'menu2' }
//             }
//         ]
//     },

//     {
//         path: 'external-link',
//         component: Layout,
//         children: [{
//             path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
//             meta: { title: 'External Link', icon: 'link' }
//         }]
//     },
//     //-------以下为开发模块
//     {
//         path: '/entrance',
//         component: () =>
//             import ('@/modules/doors/index'),
//         hidden: true
//     },
//     {
//         path: '/parkBind',
//         component: Layout,
//         children: [{
//             path: 'parkBind',
//             name: '园区绑定',
//             component: () =>
//                 import ('@/modules/parkBind/index'),
//             meta: { title: '园区绑定', icon: 'table' }
//         }]
//     },
//     {
//         path: '/studentManagement',
//         component: Layout,
//         redirect: '/studentManagement/studentList',
//         name: 'studentManagement',
//         meta: {
//             title: '学生管理',
//             icon: 'link'
//         },
//         children: [{
//                 path: 'studentList',
//                 name: 'studentList',
//                 component: () =>
//                     import ('@/modules/studentManagement/studentList/index'),
//                 meta: { title: '学生名单', icon: 'link' }
//             },
//             {
//                 path: 'studentAdd',
//                 name: 'studentAdd',
//                 component: () =>
//                     import ('@/modules/studentManagement/studentAdd/index'),
//                 meta: { title: '添加学生', icon: 'link' }
//             }
//         ]
//     },
//     { path: '*', redirect: '/404', hidden: true }
// ]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})