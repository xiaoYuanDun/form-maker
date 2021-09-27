### 通过配置文件, 快速生成 form 表单

1.  使用 ListItem 时, 一定要指定 listIndex 和 listKey, 他们是组成单项 name 的参数, 表单时会根据组合名进行校验
2.  使用 ListItem 时, 渲染的行数是根据外层数据的数量决定的, 所以此时 listIndex 的优先级最高
3.  rowExtra: 每行的额外渲染
4.  hidden itme 有可能出现在 Row 层级, 也有可能出现在 Col 层级, 每层都需要特殊处理一下
5.  若存在自定义 Item, 配置时需要先使用同名 name 就行占位, renderSingleCol 时匹配到该同名 name 时, 会优先使用自定义 Item

```ts
export const ATTR_FORM_CONFIG = [
  {
    gutter: 30,
    listKey: ATTR_FORM_LIST_KEY,
    cols: [
      {
        span: 7,
        item: {
          name: 'attrName',
          label: '属性名',
          rules: [
            { required: true, message: '必填项不能为空' },
            () => ({ validator: COMMON_FORMAT_CHECK }),
          ],
        },
        component: {
          __type: Mentions,
          placeholder: '请输入',
          maxLength: 20,
        },
      },
      {
        span: 7,
        item: {
          name: 'displayName',
          label: '属性显示名',
          rules: [
            { required: true, message: '必填项不能为空' },
            () => ({ validator: COMMON_BLANK_CHECK }),
          ],
        },
        component: {
          __type: Input,
          placeholder: '请输入',
          maxLength: 20,
        },
      },
      {
        span: 7,
        item: {
          name: 'type',
          label: '数据类型',
          rules: [{ required: true, message: '必填项不能为空' }],
        },
        component: {
          __type: Select,
          options: DEFAULT_ATTR_TYPE,
          placeholder: '请选择',
        },
      },
      {
        hidden: true,
        name: 'id',
        __type: Input,
      },
    ],
  },
];
```

### 待完善文档, 配置格式, 生产环境压缩, 去掉通用格式(暂时), 分离类型文件

// "main": "./lib/index.js",
// "module": "./es/index.js",
// "types": "./lib/index.d.ts",
