# antd-form-creator

基于 antd-form, 使用固定格式的配置文件, 快速生成 form 表单

## 📦 Install

```js
yarn add antd-form-creator -S

npm install antd-form-creator -S
```

## 🔨 Usage

```js
import formCreator from 'antd-form-creator';
```

## API

### 主要参数

`Array<NormalRow \| HiddenItemConfig>`
| 参数 | 说明 | 类型 | 默认值 |
| :----------- | :----------------- | :------------------------------------: | ------ |
| formConfig | 表单基本配置 | [FormConfig](#FormConfig) | |
| runtimeProps | 表单项运行时变量 | [RuntimeProps](#RuntimeProps) | |
| rowExtra | 表单行额外渲染占位 | `rowExtra` | |
| listIndex | 行索引 | `number` | |

### <a id="FormConfig">FormConfig</a>

一个完整的配置文件由多个行配置组成, 其中可能包括隐藏字段
Array<[NormalRow](#NormalRow)\|[HiddenItemConfig](#HiddenItemConfig)>

### <a id="NormalRow">NormalRow</a>

表单行配置

常规配置文件按行为一个大单元进行划分, 每行中含有 n 个 FormItem, 根据情况自定义, 可以在这里定义每个 FormItem 的栅格配置

| 参数        | 说明                             |                          类型                          | 默认值 |
| :---------- | :------------------------------- | :----------------------------------------------------: | ------ |
| cols        | 表单基本配置                     |               [ColConfig](#ColConfig)[]                |        |
| listKey     | 有此值, 代表当前为 FormList 形式 |                        `string`                        |        |
| ...RowProps | 兼容 antd.Row 的 props           | [RowProps](https://ant.design/components/grid-cn/#Row) |        |

### <a id="HiddenItemConfig">HiddenItemConfig</a>

通用的隐藏配置

因为可能存在 hidden 字段(功能与其他表单项相同, 只是不展示), 所以用一个通用的隐藏配置
隐藏 Item 无需配置 Row, Col 等, 会直接在 renderSingleRow 中特殊处理含有 hidden 的 Item

| 参数     | 说明     |   类型    | 默认值 |
| :------- | :------- | :-------: | ------ |
| hidden   | 是否隐藏 | `boolean` |        |
| name     | 字段名   | `string`  |        |
| \_\_type | 字段组件 |   `any`   |        |

### <a id="ColConfig">ColConfig</a>

一个完整的配置文件由多个 Col 配置组成, 其中可能包括隐藏字段
Array<[NormalCol](#NormalCol)\|[HiddenItemConfig](#HiddenItemConfig)>

### <a id="ColConfig">NormalCol</a>

一个 Col 一般指代一个 Form.Item, 所以配置文件可能包括 Col, Form.Item 和 Item 内部包括的实际控件

其中 `__type` 是字段控件, 因为要在 FromItem 中使用, 需要满足 antd 的[自定义控件要求](https://ant.design/components/form-cn/#components-form-demo-customized-form-controls)

| 参数        | 说明                        |                               类型                                | 默认值 |
| :---------- | :-------------------------- | :---------------------------------------------------------------: | ------ |
| item        | 兼容 antd.FormItem 的 props | [FormItemProps](https://ant.design/components/form-cn/#Form.Item) |        |
| component   | 字段组件配置                |              `{ __type: any, [attr: string]: any }`               |        |
| ...ColProps | 兼容 antd.Col 的 props      |      [ColProps](https://ant.design/components/grid-cn/#Col)       |        |

### <a id="RuntimeProps">RuntimeProps</a>

有一些属性是需要运行时动态改变或获取的, 无法通过配置文件的方式固定, 所以这里提供一个给字段控件注入运行时属性的入口

其中 `componentProps` 和 `itemProps` 就是最终被动态合并的 hash 对象, 可以直接提供一个对象, 也可以提供一个函数, 在每个字段控件渲染是, 其字段名会作为参数传过来, 用于自定义判断

| 参数           | 说明              |         类型         | 默认值                                 |
| :------------- | :---------------- | :------------------: | -------------------------------------- | --- |
| key            | 字段名            |       `string`       |                                        |
| componentProps | 字段控件动态属性  | `Record<string, any> | (name: string) => Record<string, any>` |     |
| itemProps      | FormItem 动态属性 | `Record<string, any> | (name: string) => Record<string, any>` |     |

## Demo

```ts
import formCreator from 'antd-form-creator';
import { Form } from 'antd';

// 配置文件示例
export const FORM_CONFG = [
  {
    gutter: 60,
    cols: [
      {
        span: 12,
        item: {
          name: 'field-1',
          label: '字段-1',
          rules: [
            { required: true, message: '必填项不能为空' },
            () => ({ validator: COMMON_BLANK_CHECK }),
            () => ({ validator: COMMON_FORMAT_CHECK_WITH_CHINESE }),
          ],
        },
        component: {
          __type: Input,
          placeholder: '请输入',
          maxLength: 20,
        },
      },
      {
        span: 12,
        item: {
          name: 'field-2',
          label: '字段-2',
          rules: [{ required: true, message: '必填项不能为空' }],
        },
        component: {
          __type: Input,
          placeholder: '请输入',
          maxLength: 20,
        },
      },
    ],
  },
  {
    gutter: 60,
    cols: [
      {
        span: 12,
        item: {
          name: 'field-3',
          label: '字段-3',
        },
        component: {
          __type: Select,
          mode: 'multiple',
          options: [],
          placeholder: '请选择',
        },
      },
    ],
  },
  {
    gutter: 0,
    cols: [
      {
        span: 24,
        item: {
          name: 'field-4',
          label: '字段-4',
        },
        component: {
          __type: Input,
          placeholder: '请输入这个这个玩意',
        },
      },
    ],
  },
  {
    gutter: 0,
    cols: [
      {
        span: 24,
        item: {
          name: 'field-5',
          label: '字段-5',
        },
        component: {
          __type: TextArea,
          rows: 3,
          placeholder: '请输入',
        },
      },
    ],
  },
  {
    gutter: 0,
    cols: [
      {
        span: 24,
        item: {
          name: 'tags',
          label: '标签',
        },
        component: {
          __type: Tags,
        },
      },
    ],
  },
  {
    hidden: true,
    name: 'id',
    __type: Input,
  },
];

// ... 一些逻辑代码
const [form] = useForm();

const content = (
  <Form layout="vertical" form={form} autoComplete="off" className="xxx-form">
    {formMaker({
      formConfig: FORM_CONFG,
      runtimeProps: {
        // 编辑模式下, CANNOT_EDIT_LIST 所包含的字段不可编辑, 由于这里的 '是否为编辑模式' 不可提前配置, 所以用动态注入的方式
        componentProps: (name: string) => ({
          disabled: !isCreateMode && !!~CANNOT_EDIT_LIST.indexOf(name),
        }),
      },
    })}
  </Form>
);
```

## TODO

- [x] 生产环境压缩,
- [ ] 去掉通用格式(暂时)
- [ ] 分离类型文件
- [ ] 更多例子, FormList

<!--
"main": "./lib/index.js",
"module": "./es/index.js",
"types": "./lib/index.d.ts",
-->
