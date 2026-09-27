---
title: Modifiers 组件参考
description: 用于 @expo/ui 组件的 Jetpack Compose 布局修饰符。
---

# Modifiers 组件参考

> 支持平台：Android、Expo Go。

Jetpack Compose 修饰符让你可以自定义 UI 组件的布局、外观和行为。修饰符相当于 Compose 中的样式属性——它们控制尺寸、内边距、背景、交互等。

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

修饰符通过 `modifiers` 属性以数组语法应用到组件上。你可以组合多个修饰符，形成复杂的样式和行为。修饰符按数组中的顺序应用，这会影响最终结果（例如先应用 `padding` 再应用 `background`，与相反顺序的结果不同）。

```tsx
import { Button, Host } from '@expo/ui/jetpack-compose';
import {
  paddingAll,
  fillMaxWidth,
  background,
  border,
  shadow,
  clickable,
} from '@expo/ui/jetpack-compose/modifiers';

function ModifiersExample() {
  return (
    <Host style={{ flex: 1 }}>

      <Button
        modifiers={[
          paddingAll(16),
          fillMaxWidth(),
          background('#FF6B6B'),
        ]}>
        Full-width padded button
      </Button>

      <Button
        modifiers={[
          paddingAll(12),
          background('#4ECDC4'),
          border(2, '#2C3E50'),
          shadow(4),
        ]}>
        Styled with border and shadow
      </Button>
    </Host>
  );
}
```

:::note
你也可以创建适用于任何 Expo UI 组件的自定义修饰符。详见[自定义 Jetpack Compose 组件](/versions/latest/sdk/ui/jetpack-compose/extending)。
:::

## 内边距

控制组件内容周围的间距。

### `paddingAll(all)`

在四边应用相等的内边距。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `all` | `number` | 内边距值，单位 dp。 |

```tsx
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';

<Button modifiers={[paddingAll(16)]}>Padded button</Button>;
```

### `padding(start, top, end, bottom)`

为每一边分别应用内边距。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `start` | `number` | 左侧/起始内边距，单位 dp。 |
| `top` | `number` | 顶部内边距，单位 dp。 |
| `end` | `number` | 右侧/结束内边距，单位 dp。 |
| `bottom` | `number` | 底部内边距，单位 dp。 |

```tsx
import { padding } from '@expo/ui/jetpack-compose/modifiers';

<Button modifiers={[padding(16, 8, 16, 8)]}>Custom padding</Button>;
```

## 尺寸

控制组件的尺寸。

### `size(width, height)`

为组件设置精确尺寸。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `width` | `number` | 宽度，单位 dp。 |
| `height` | `number` | 高度，单位 dp。 |

```tsx
import { size } from '@expo/ui/jetpack-compose/modifiers';

<Button modifiers={[size(200, 48)]}>Fixed size</Button>;
```

### `fillMaxSize(fraction?)`

在两个方向上填满所有可用空间。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `fraction` | `number` | 可用空间的比例（0.0–1.0）。默认 `1.0`。 |

```tsx
import { fillMaxSize } from '@expo/ui/jetpack-compose/modifiers';

<Button modifiers={[fillMaxSize()]}>Fill all space</Button>
<Button modifiers={[fillMaxSize(0.5)]}>Fill half</Button>
```

### `fillMaxWidth(fraction?)`

填满可用宽度。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `fraction` | `number` | 可用宽度的比例（0.0–1.0）。默认 `1.0`。 |

```tsx
import { fillMaxWidth } from '@expo/ui/jetpack-compose/modifiers';

<Button modifiers={[fillMaxWidth()]}>Full width</Button>;
```

### `fillMaxHeight(fraction?)`

填满可用高度。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `fraction` | `number` | 可用高度的比例（0.0–1.0）。默认 `1.0`。 |

### `width(value)`

设置精确宽度。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `number` | 宽度，单位 dp。 |

### `height(value)`

设置精确高度。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `number` | 高度，单位 dp。 |

### `wrapContentWidth(alignment?)`

让组件尺寸包裹其内容宽度。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `alignment` | `string` | 内容的水平对齐方式。 |

### `wrapContentHeight(alignment?)`

让组件尺寸包裹其内容高度。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `alignment` | `string` | 内容的垂直对齐方式。 |

## 位置

控制组件相对于其自然位置的偏移。

### `offset(x, y)`

把组件从其自然位置偏移，而不影响周围组件的布局。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `x` | `number` | 水平偏移，单位 dp。 |
| `y` | `number` | 垂直偏移，单位 dp。 |

```tsx
import { offset } from '@expo/ui/jetpack-compose/modifiers';

<Button modifiers={[offset(10, 5)]}>Offset button</Button>;
```

## 外观

控制组件的视觉外观。

### `background(color)`

设置背景颜色。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `color` | `string` | 背景颜色（十六进制字符串）。 |

```tsx
import { background } from '@expo/ui/jetpack-compose/modifiers';

<Button modifiers={[background('#3498DB')]}>
  Blue background
</Button>;
```

### `border(borderWidth, borderColor)`

在组件周围添加边框。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `borderWidth` | `number` | 边框宽度，单位 dp。 |
| `borderColor` | `string` | 边框颜色（十六进制字符串）。 |

```tsx
import { border } from '@expo/ui/jetpack-compose/modifiers';

<Button modifiers={[border(2, '#E74C3C')]}>Bordered button</Button>;
```

### `shadow(elevation)`

在组件下方添加高度阴影。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `elevation` | `number` | 阴影高度，单位 dp。 |

```tsx
import { shadow } from '@expo/ui/jetpack-compose/modifiers';

<Button modifiers={[shadow(8)]}>Elevated button</Button>;
```

### `dropShadow(shape, config?)`

在组件后方绘制阴影，可控制模糊半径、扩散、偏移和颜色。与 `shadow` 不同，它不需要高度值。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `shape` | `Shape` | 阴影形状（见下方形状表）。 |
| `config.radius` | `number` | 模糊半径，单位 dp。 |
| `config.spread` | `number` | 扩展（正值）或收缩（负值）的量，单位 dp。 |
| `config.color` | `string` | 阴影颜色（十六进制字符串）。默认为黑色。 |
| `config.offsetX` | `number` | 水平偏移，单位 dp。 |
| `config.offsetY` | `number` | 垂直偏移，单位 dp。 |
| `config.alpha` | `number` | 阴影不透明度（0.0–1.0）。 |

```tsx
import {
  dropShadow,
  Shapes,
} from '@expo/ui/jetpack-compose/modifiers';

<Button
  modifiers={[
    dropShadow(Shapes.RoundedCorner(24), {
      radius: 16,
      spread: 4,
      color: '#6200EE',
      offsetY: 8,
    }),
  ]}>
  Drop shadow
</Button>;
```

### `innerShadow(shape, config?)`

在组件内部绘制阴影，形成内凹效果。先应用 `background` 修饰符，再应用 `innerShadow`，阴影才会渲染。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `shape` | `Shape` | 阴影形状（见下方形状表）。 |
| `config.radius` | `number` | 模糊半径，单位 dp。 |
| `config.spread` | `number` | 扩展（正值）或收缩（负值）的量，单位 dp。 |
| `config.color` | `string` | 阴影颜色（十六进制字符串）。默认为黑色。 |
| `config.offsetX` | `number` | 水平偏移，单位 dp。 |
| `config.offsetY` | `number` | 垂直偏移，单位 dp。 |
| `config.alpha` | `number` | 阴影不透明度（0.0–1.0）。 |

```tsx
import {
  innerShadow,
  background,
  Shapes,
} from '@expo/ui/jetpack-compose/modifiers';

<Button
  modifiers={[
    background('#FFFFFF'),
    innerShadow(Shapes.RoundedCorner(24), {
      radius: 16,
      spread: 2,
      offsetY: 6,
    }),
  ]}>
  Inner shadow
</Button>;
```

### `alpha(alpha)`

控制组件的不透明度。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `alpha` | `number` | 不透明度值（0.0–1.0）。 |

```tsx
import { alpha } from '@expo/ui/jetpack-compose/modifiers';

<Button modifiers={[alpha(0.5)]}>Semi-transparent</Button>;
```

### `blur(radius)`

对组件应用模糊效果。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `radius` | `number` | 模糊半径，单位 dp。 |

```tsx
import { blur } from '@expo/ui/jetpack-compose/modifiers';

<Button modifiers={[blur(4)]}>Blurred button</Button>;
```

### `cornerRadius(radius)`

为组件添加圆角。

:::note
仅在用 `expo-widgets` 构建的 Android 小组件内有效，且需要 Android 12（API 级别 31）及更高版本。
:::

Jetpack Compose 没有与 Glance 的 `cornerRadius` 完全对应的能力，因此 Expo UI 会忽略该修饰符。在应用中请使用 [`clip(Shapes.RoundedCorner(radius))`](#clipshape) 来做圆角。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `radius` | `number` | 圆角半径，单位 dp。 |

```tsx
import {
  background,
  cornerRadius,
} from '@expo/ui/jetpack-compose/modifiers';

<Box modifiers={[cornerRadius(12), background('#3498DB')]} />;
```

## 阴影配方

常见阴影样式是 `dropShadow` 与 `innerShadow` 修饰符的组合，而不是单独的 API。因为 `modifiers` 属性接受数组，你可以叠加并调整阴影修饰符来构成每种样式。

### 新野兽派阴影

新野兽派阴影是无模糊、带粗边框的硬边投影。把 `radius` 和 `spread` 设为 `0`，再偏移阴影。

```tsx
import {
  dropShadow,
  border,
  background,
  Shapes,
} from '@expo/ui/jetpack-compose/modifiers';

<Box
  modifiers={[
    dropShadow(Shapes.Rectangle, {
      radius: 0,
      spread: 0,
      offsetX: 8,
      offsetY: 8,
      color: '#000000',
    }),
    border(8, '#000000'),
    background('#FFFFFF'),
  ]}
/>;
```

### 新拟态阴影

新拟态阴影在与背景同色的表面上叠加两层投影：朝向光源的浅色阴影，以及相反一侧的深色阴影。两者都要在 `background` 之前应用。

```tsx
import {
  dropShadow,
  background,
  Shapes,
} from '@expo/ui/jetpack-compose/modifiers';

const shape = Shapes.RoundedCorner(24);

<Box
  modifiers={[
    dropShadow(shape, {
      radius: 15,
      offsetX: -10,
      offsetY: -10,
      color: '#FFFFFF',
    }),
    dropShadow(shape, {
      radius: 15,
      offsetX: 10,
      offsetY: 10,
      color: '#B1B1B1',
    }),
    background('#E0E0E0'),
  ]}
/>;
```

要做出按下后的凹陷变体，改用两个 `innerShadow` 修饰符，并放在 `background` 之后。

## 变换

对组件应用视觉变换。

### `rotate(degrees)`

旋转组件。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `degrees` | `number` | 旋转角度，单位为度。 |

```tsx
import { rotate } from '@expo/ui/jetpack-compose/modifiers';

<Button modifiers={[rotate(45)]}>Rotated</Button>;
```

### `zIndex(index)`

控制重叠组件的绘制顺序。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `index` | `number` | 图层索引。 |

```tsx
import { zIndex } from '@expo/ui/jetpack-compose/modifiers';

<Button modifiers={[zIndex(10)]}>On top</Button>;
```

## 动画

为组件内的布局变化添加动画。

### `animateContentSize(dampingRatio?, stiffness?)`

用弹簧动画为组件内容的尺寸变化添加动画。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `dampingRatio` | `number` | 弹簧阻尼比。控制回弹程度。 |
| `stiffness` | `number` | 弹簧刚度。控制动画速度。 |

```tsx
import { animateContentSize } from '@expo/ui/jetpack-compose/modifiers';

<Button modifiers={[animateContentSize()]}>Animated size</Button>
<Button modifiers={[animateContentSize(0.5, 200)]}>Custom spring</Button>
```

## 布局

控制组件在父容器中的尺寸和位置。

### `weight(weight)`

为 `Row` 或 `Column` 内的组件分配弹性权重，按比例在带权重的子节点之间分配可用空间。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `weight` | `number` | 权重系数。 |

```tsx
import { weight } from '@expo/ui/jetpack-compose/modifiers';

// 在 Row 中，第一个按钮占 2/3，第二个占 1/3
<Button modifiers={[weight(2)]}>Wider</Button>
<Button modifiers={[weight(1)]}>Narrower</Button>
```

### `align(alignment)`

设置组件在父容器中的对齐方式。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `alignment` | `string` | 在容器中的对齐方式。 |

### `matchParentSize()`

让组件尺寸匹配其父级 `Box` 的尺寸。与 `fillMaxSize` 不同，这不会影响父级的测量。

```tsx
import { matchParentSize } from '@expo/ui/jetpack-compose/modifiers';

<Button modifiers={[matchParentSize()]}>Match parent</Button>;
```

## 交互

为组件添加用户交互处理。

### `clickable(handler)`

让组件响应点击事件。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `handler` | `() => void` | 点击时调用的回调。 |

```tsx
import { clickable } from '@expo/ui/jetpack-compose/modifiers';

<Button modifiers={[clickable(() => console.log('Clicked!'))]}>
  Clickable
</Button>;
```

### `combinedClickable(handlers, options?)`

让组件同时响应短按和长按手势。封装了 Compose 的 `Modifier.combinedClickable`。适合在长按时打开 [`DropdownMenu`](/versions/latest/sdk/ui/jetpack-compose/dropdownmenu)，同时在同一视图上保留单独的短按操作。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `handlers.onClick` | `() => void` | 短按时调用的可选回调。 |
| `handlers.onLongClick` | `() => void` | 长按时调用的可选回调。 |
| `options.indication` | `boolean` | 是否显示涟漪指示。默认为 `true`。 |

```tsx
import { Text } from '@expo/ui/jetpack-compose';
import { combinedClickable } from '@expo/ui/jetpack-compose/modifiers';

<Text
  modifiers={[
    combinedClickable({
      onClick: () => console.log('Tapped'),
      onLongClick: () => setMenuExpanded(true),
    }),
  ]}>
  Long-press me
</Text>;
```

### `selectable(selected, handler)`

让组件可选中，类似于单选按钮。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `selected` | `boolean` | 组件当前是否被选中。 |
| `handler` | `() => void` | 选中状态变化时调用的回调。 |

```tsx
import { selectable } from '@expo/ui/jetpack-compose/modifiers';

<Button
  modifiers={[
    selectable(isSelected, () => setIsSelected(!isSelected)),
  ]}>
  Selectable option
</Button>;
```

## 裁剪

把组件内容裁剪为特定形状。

### `clip(shape)`

把组件裁剪为给定形状。形状边界之外的内容不会绘制。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `shape` | `Shape` | 要裁剪到的形状。 |

#### 可用形状

| 形状 | 说明 |
| --- | --- |
| `Shapes.Rectangle` | 没有圆角的矩形。 |
| `Shapes.Circle` | 正圆。 |
| `Shapes.RoundedCorner(radius)` | 圆角均匀的矩形。传入 `number` 表示相等半径，或传入对象 `{ topStart, topEnd, bottomStart, bottomEnd }` 为各角分别指定半径。 |
| `Shapes.CutCorner(radius)` | 切角（倒角）矩形。接受与 `RoundedCorner` 相同的半径选项。 |
| `Shapes.Material.Cookie4Sided` | 四边的 Material Design cookie 形状。 |
| `Shapes.Material.Cookie6Sided` | 六边的 Material Design cookie 形状。 |

```tsx
import { clip } from '@expo/ui/jetpack-compose/modifiers';
import { Shapes } from '@expo/ui/jetpack-compose/modifiers';

// 圆形裁剪
<Button modifiers={[clip(Shapes.Circle)]}>Circle</Button>

// 统一半径的圆角
<Button modifiers={[clip(Shapes.RoundedCorner(12))]}>Rounded</Button>

// 各角半径不同的圆角
<Button
  modifiers={[
    clip(Shapes.RoundedCorner({ topStart: 16, topEnd: 16, bottomStart: 0, bottomEnd: 0 })),
  ]}>
  Top rounded only
</Button>

// 切角
<Button modifiers={[clip(Shapes.CutCorner(8))]}>Cut corners</Button>
```

## 工具

### `testID(tag)`

为组件指定测试标识符，供 UI 测试使用。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `tag` | `string` | 测试 ID。 |

```tsx
import { testID } from '@expo/ui/jetpack-compose/modifiers';

<Button modifiers={[testID('submit-button')]}>Submit</Button>;
```

## API

```tsx
import { paddingAll, padding, size, fillMaxWidth, background, clickable, clip, Shapes } from '@expo/ui/jetpack-compose/modifiers';
```
