/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import React, { createElement, isValidElement, ReactElement } from 'react';
import { Row, Col, RowProps, ColProps } from 'antd/es/grid';
import Form, { FormItemProps } from 'antd/es/form';

const { Item } = Form;

type GetDetails<T> = {
  [K in keyof T]: T[K];
};

// 一个 Col 一般指代一个 Form.Item, 所以配置文件可能包括 Col, Form.Item 和 Item内部包括的实际控件
type NormalCol = ColProps & {
  item: FormItemProps;
  component: {
    __type: any;
    [attr: string]: any;
  };
  listKey?: string;
};

type ColConfig = GetDetails<NormalCol | HiddenItemConfig>;

// 隐藏 Item 无需配置 Row, Col 等, 会直接在 renderSingleRow 中特殊处理含有 hidden 的 Item
type HiddenItemConfig = {
  hidden: boolean;
  name: string;
  __type: any;
};

// 有 listKey 标识, 代表是 ListItem
type NormalRow = GetDetails<RowProps & { cols: ColConfig[]; listKey?: string }>;

type RowConfig = NormalRow | HiddenItemConfig;

type FormConfig = GetDetails<RowConfig>[];

type RuntimeProps = {
  key?: string;
  componentProps?: Record<string, any>;
  itemProps?: Record<string, any>;
};

type RenderColSharp = (
  args: {
    colConfig: ColConfig;
    index: number;
    runtimeProps?: RuntimeProps;
    listKey?: string;
    listIndex?: number;
  },
  customItems?: Record<string, any>
) => ReactElement;

type RenderRowSharp = (
  args: {
    rowConfig: RowConfig;
    index: number;
    runtimeProps?: RuntimeProps;
    listIndex?: number;
  },
  extra?: any
) => ReactElement;

const renderSingleCol: RenderColSharp = (
  { colConfig, index, runtimeProps = {}, listKey, listIndex },
  customItems = {}
) => {
  const { hidden, name, __type: HiddenElement } = colConfig as HiddenItemConfig;

  if (hidden) {
    return (
      <Item
        name={listKey !== undefined ? [listKey, listIndex!, name] : name}
        key={`${index}-${name}`}
        hidden
      >
        {createElement(HiddenElement)}
      </Item>
    );
  }

  const {
    item,
    component: { __type, ...props },
    ...colProps
  } = colConfig as NormalCol;

  let { componentProps = {}, itemProps = {} } = runtimeProps;

  // 合并运行时变量
  componentProps = {
    ...props,
    ...(typeof componentProps === 'function'
      ? componentProps(item.name)
      : componentProps[item.name as string]),
  };

  itemProps = {
    ...item,
    ...(listKey !== undefined ? { name: [listKey, listIndex, item.name] } : {}),
    ...(typeof itemProps === 'function'
      ? itemProps(item.name)
      : itemProps[item.name as string]),
  };

  let __Component;

  if (customItems[item.name as string]) {
    __Component = (
      <Col {...colProps} key={`${index}-${item.name}`}>
        {typeof customItems[item.name as string] === 'function'
          ? customItems[item.name as string](itemProps)
          : customItems[item.name as string]}
      </Col>
    );
  } else {
    __Component = (
      <Col key={`${index}-${item.name}`} {...colProps}>
        <Item {...itemProps}>{createElement(__type, componentProps)}</Item>
      </Col>
    );
  }

  return __Component;
};

const renderSingleRow: RenderRowSharp = (
  { rowConfig, index, runtimeProps },
  rowExtra
) => {
  // TODO isValidElement

  // hidden 单独处理一下
  const { hidden, name, __type } = rowConfig as HiddenItemConfig;
  if (hidden) {
    return (
      <Item name={name} key={index} hidden>
        {createElement(__type)}
      </Item>
    );
  }

  const { cols, listKey, ...rowProps } = rowConfig as NormalRow;
  const colChildrens = cols.map((col, i) =>
    renderSingleCol({
      colConfig: col,
      index: i,
      runtimeProps,
      listKey,
      listIndex: index,
    })
  );

  const extraElement = rowExtra
    ? typeof rowExtra === 'function'
      ? rowExtra()
      : rowExtra
    : null;

  return (
    <Row key={index} {...rowProps}>
      {colChildrens}
      {extraElement}
    </Row>
  );
};

const formCreator = ({
  formConfig,
  runtimeProps,
  rowExtra,
  listIndex,
}: {
  formConfig: FormConfig;
  runtimeProps?: RuntimeProps;
  rowExtra?: any;
  listIndex?: number;
}) =>
  formConfig.map((row, index) =>
    renderSingleRow(
      { rowConfig: row, index: listIndex || index, runtimeProps },
      rowExtra
    )
  );

export default formCreator;
