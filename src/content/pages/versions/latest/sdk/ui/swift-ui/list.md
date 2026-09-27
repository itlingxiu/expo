---
title: List 组件参考
description: 用于显示可滚动项目列表的 SwiftUI List 组件。
---

# List 组件参考

> 支持平台：iOS、tvOS、Expo Go。

:::note
跨平台用法请参阅通用 [`List`](/versions/latest/sdk/ui/universal/list)——它会按平台渲染对应的原生组件。
:::

Expo UI 的 List 与官方 SwiftUI [List API](https://developer.apple.com/documentation/swiftui/list) 保持一致，并支持通过 [`listStyle`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符、各种行/分区修饰符设置样式，以及选择、重排和编辑能力。

:::note
`List` 目前还不会惰性渲染行：React 会预先创建每一行，因此大型列表挂载可能较慢。我们正在改进这一点。大型列表建议使用 [FlashList](https://shopify.github.io/flash-list) 或 [Legend List](https://github.com/LegendApp/legend-list)。
:::

![List 含 Favorites 和 Recents 分区，每行显示彩色 SF Symbol 图标和标签](/static/images/expo-ui/list/ios-light.webp)

## 安装

:::tabs
:::tab npm
```sh
npx expo install @expo/ui
```
:::
:::tab yarn
```sh
yarn expo install @expo/ui
```
:::
:::tab pnpm
```sh
pnpm expo install @expo/ui
```
:::
:::tab bun
```sh
bun expo install @expo/ui
```
:::
:::

## 用法

### 基本列表

![含 Fruits 和 Vegetables 分区的列表](/static/images/expo-ui/examples/list-basic-ios-light.webp)

```tsx BasicListExample.tsx
import { Host, List, Text, Section } from '@expo/ui/swift-ui';

export default function BasicListExample() {
  return (
    <Host style={{ flex: 1 }}>
      <List>
        <Section title="Fruits">
          <Text>Apple</Text>
          <Text>Banana</Text>
          <Text>Orange</Text>
        </Section>
        <Section title="Vegetables">
          <Text>Carrot</Text>
          <Text>Broccoli</Text>
          <Text>Spinach</Text>
        </Section>
      </List>
    </Host>
  );
}
```

### 带标签和图标的列表

![Settings 列表含 Wi-Fi、Bluetooth 和 Cellular 行，带蓝色 SF Symbol 图标](/static/images/expo-ui/examples/list-with-labels-ios-light.webp)

```tsx ListWithLabelsExample.tsx
import { Host, List, Label, Section } from '@expo/ui/swift-ui';

export default function ListWithLabelsExample() {
  return (
    <Host style={{ flex: 1 }}>
      <List>
        <Section title="Settings">
          <Label title="Wi-Fi" systemImage="wifi" />
          <Label
            title="Bluetooth"
            systemImage="antenna.radiowaves.left.and.right"
          />
          <Label
            title="Cellular"
            systemImage="antenna.radiowaves.left.and.right.circle"
          />
        </Section>
      </List>
    </Host>
  );
}
```

### 列表样式

使用 [`listStyle`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符改变列表外观。

:::note
`inset`、`insetGrouped` 和 `sidebar` 样式在 tvOS 上不可用。
:::

![列表带 List Style 菜单选择器，设为 automatic，并有三个示例项](/static/images/expo-ui/examples/list-styles-ios-light.webp)

```tsx ListStylesExample.tsx
import { useState } from 'react';
import {
  Host,
  List,
  Text,
  Section,
  Picker,
} from '@expo/ui/swift-ui';
import {
  listStyle,
  pickerStyle,
  tag,
} from '@expo/ui/swift-ui/modifiers';

const styles = [
  'automatic',
  'plain',
  'inset',
  'insetGrouped',
  'grouped',
  'sidebar',
] as const;

export default function ListStylesExample() {
  const [styleIndex, setStyleIndex] = useState(0);

  return (
    <Host style={{ flex: 1 }}>
      <List modifiers={[listStyle(styles[styleIndex])]}>
        <Section title="Style Picker">
          <Picker
            label="List Style"
            selection={styleIndex}
            onSelectionChange={setStyleIndex}
            modifiers={[pickerStyle('menu')]}>
            {styles.map((style, index) => (
              <Text key={style} modifiers={[tag(index)]}>
                {style}
              </Text>
            ))}
          </Picker>
        </Section>
        <Section title="Sample Items">
          <Text>Item 1</Text>
          <Text>Item 2</Text>
          <Text>Item 3</Text>
        </Section>
      </List>
    </Host>
  );
}
```

### 选择与编辑模式

使用带 `onDelete` 和 `onMove` 属性的 [`List.ForEach`](#listforeach) 复合组件，启用列表项的选择、删除和重排。

- 使用 [`environment`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符启用编辑模式
- 使用 `keyExtractor` 属性标识项目
- 使用 [`selection`](#selection) 属性控制选中项
- 使用 [`moveDisabled`](/versions/latest/sdk/ui/swift-ui/modifiers) 和 [`deleteDisabled`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符在单个项目上禁用这些操作

![带编辑模式开关和四行任务的列表](/static/images/expo-ui/examples/list-editable-ios-light.webp)

```tsx EditableListExample.tsx
import { useState } from 'react';
import {
  Host,
  List,
  Label,
  Section,
  Button,
  Toggle,
} from '@expo/ui/swift-ui';
import { environment } from '@expo/ui/swift-ui/modifiers';

type Task = { id: string; title: string };

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Task 1' },
  { id: '2', title: 'Task 2' },
  { id: '3', title: 'Task 3' },
  { id: '4', title: 'Task 4' },
];

export default function EditableListExample() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);

  const handleDelete = (indices: number[]) => {
    setTasks(prev => prev.filter((_, i) => !indices.includes(i)));
  };

  const handleMove = (
    sourceIndices: number[],
    destination: number
  ) => {
    setTasks(prev => {
      const newTasks = [...prev];
      const [removed] = newTasks.splice(sourceIndices[0], 1);
      const adjustedDest =
        sourceIndices[0] < destination
          ? destination - 1
          : destination;
      newTasks.splice(adjustedDest, 0, removed);
      return newTasks;
    });
  };

  return (
    <Host style={{ flex: 1 }}>
      <List
        selection={selectedIds}
        onSelectionChange={ids => setSelectedIds(ids.map(String))}
        modifiers={[
          environment('editMode', editMode ? 'active' : 'inactive'),
        ]}>
        <Section title="Settings">
          <Toggle
            label="Edit mode"
            isOn={editMode}
            onIsOnChange={setEditMode}
          />
        </Section>
        <Section title="Tasks">
          <List.ForEach
            data={tasks}
            keyExtractor={task => task.id}
            onDelete={handleDelete}
            onMove={handleMove}>
            {({ item }) => <Label title={item.title} />}
          </List.ForEach>
        </Section>
      </List>
    </Host>
  );
}
```

### 下拉刷新

使用 [`refreshable`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符启用下拉刷新。

![带 Pull down to refresh 行的列表](/static/images/expo-ui/examples/list-refreshable-ios-light.webp)

```tsx RefreshableListExample.tsx
import { useState } from 'react';
import { Host, List, Text, Section } from '@expo/ui/swift-ui';
import { refreshable } from '@expo/ui/swift-ui/modifiers';

export default function RefreshableListExample() {
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const handleRefresh = async () => {
    // 模拟异步数据获取
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastRefresh(new Date());
  };

  return (
    <Host style={{ flex: 1 }}>
      <List modifiers={[refreshable(handleRefresh)]}>
        <Section title="Data">
          <Text>Pull down to refresh</Text>
          {lastRefresh && (
            <Text>
              Last refresh: {lastRefresh.toLocaleTimeString()}
            </Text>
          )}
        </Section>
      </List>
    </Host>
  );
}
```

### 行样式

使用 [`listRowBackground`](/versions/latest/sdk/ui/swift-ui/modifiers)、[`listRowSeparator`](/versions/latest/sdk/ui/swift-ui/modifiers)、[`listRowSeparatorTint`](/versions/latest/sdk/ui/swift-ui/modifiers) 和 [`listRowInsets`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符自定义单行。使用带 `listRowSeparatorLeading` 参考线的 [`alignmentGuide`](/versions/latest/sdk/ui/swift-ui/modifiers) 设置行分隔线的起点。

![分组列表含蓝色行、红色分隔线、缩进行和贴边行](/static/images/expo-ui/examples/list-row-styling-ios-light.webp)

```tsx RowStylingExample.tsx
import { Host, List, Text, Section } from '@expo/ui/swift-ui';
import {
  alignmentGuide,
  listRowBackground,
  listRowSeparator,
  listRowSeparatorTint,
  listRowInsets,
} from '@expo/ui/swift-ui/modifiers';

export default function RowStylingExample() {
  return (
    <Host style={{ flex: 1 }}>
      <List>
        <Section title="Styled Rows">
          <Text modifiers={[listRowBackground('blue')]}>
            Blue background
          </Text>
          <Text modifiers={[listRowSeparator('hidden')]}>
            Hidden separator
          </Text>
          <Text modifiers={[listRowSeparatorTint('red')]}>
            Red separator
          </Text>
          <Text modifiers={[listRowInsets({ leading: 40 })]}>
            Extra leading inset
          </Text>
          <Text
            modifiers={[
              listRowInsets({ leading: 0, trailing: 0 }),
            ]}>
            No horizontal insets
          </Text>
          <Text
            modifiers={[
              alignmentGuide('listRowSeparatorLeading', 32),
            ]}>
            Separator starts 32 points in
          </Text>
        </Section>
      </List>
    </Host>
  );
}
```

### 键盘收起行为

使用 [`scrollDismissesKeyboard`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符控制滚动时如何收起键盘。

![表单列表含 Name、Email 和 Phone 文本框](/static/images/expo-ui/examples/list-keyboard-dismiss-ios-light.webp)

```tsx KeyboardDismissExample.tsx
import { Host, List, Section, TextField } from '@expo/ui/swift-ui';
import { scrollDismissesKeyboard } from '@expo/ui/swift-ui/modifiers';

export default function KeyboardDismissExample() {
  return (
    <Host style={{ flex: 1 }}>
      <List modifiers={[scrollDismissesKeyboard('interactively')]}>
        <Section title="Form">
          <TextField placeholder="Name" />
          <TextField placeholder="Email" />
          <TextField placeholder="Phone" />
        </Section>
      </List>
    </Host>
  );
}
```

### 标题突出程度

使用 [`headerProminence`](/versions/latest/sdk/ui/swift-ui/modifiers) 修饰符调整分区标题的视觉突出程度。

![两个带大号突出标题的列表分区](/static/images/expo-ui/examples/list-header-prominence-ios-light.webp)

```tsx HeaderProminenceExample.tsx
import { Host, List, Text, Section } from '@expo/ui/swift-ui';
import { headerProminence } from '@expo/ui/swift-ui/modifiers';

export default function HeaderProminenceExample() {
  return (
    <Host style={{ flex: 1 }}>
      <List modifiers={[headerProminence('increased')]}>
        <Section title="Important Section">
          <Text>This section has increased header prominence</Text>
        </Section>
        <Section title="Another Section">
          <Text>Headers are more prominent</Text>
        </Section>
      </List>
    </Host>
  );
}
```

## API

```tsx
import { List } from '@expo/ui/swift-ui';
```
