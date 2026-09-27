---
title: expo-widgets 包参考
description: 用 Expo UI 组件构建 iOS 主屏幕小组件和 Live Activities 的库。
---

# expo-widgets 包参考

> 支持平台：iOS。

:::warning
此库在 Expo Go 中不可用——请使用[开发构建](/develop/development-builds/introduction)来试用。
:::

`expo-widgets` 可以用 Expo UI 组件创建 iOS 主屏幕小组件和 Live Activities，无需编写原生代码。它提供简单的 API 来创建和更新小组件时间线，以及启动和管理 Live Activities。可以用 [`expo/ui`](/versions/latest/sdk/ui/swift-ui) 组件和修饰符构建布局。

[观看：如何构建 iOS 小组件](https://www.youtube.com/watch?v=3r_OHePTCcI)

用 TypeScript 和 expo-widgets 构建原生 iOS 主屏幕小组件。

## 已知限制

- **频繁的 Live Activity 更新。** 要提高频繁推送更新的预算，在 **Info.plist** 中把 `NSSupportsLiveActivitiesFrequentUpdates` 设为 `true`。系统仍可能限制更新频率，用户也可以在设置中关闭频繁更新。
- **小组件运行时。** 标有 `'widget'` 的组件内的代码运行在隔离的运行时中，只能使用 `@expo/ui/swift-ui` 组件，不能使用 React hooks、应用状态或异步工作。见 [widget 指令](#widget-指令)。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-widgets
```
:::
:::tab yarn
```sh
yarn expo install expo-widgets
```
:::
:::tab pnpm
```sh
pnpm expo install expo-widgets
```
:::
:::tab bun
```sh
bun expo install expo-widgets
```
:::
:::

## 在应用配置中配置

若项目使用配置插件（[持续原生生成（CNG）](/workflow/continuous-native-generation)），可以用内置的[配置插件](/config-plugins/introduction)配置 `expo-widgets`。该插件可以配置多种无法在运行时设置、必须构建新的应用二进制才能生效的属性。

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-widgets",
        {
          "widgets": [
            {
              "name": "MyWidget",
              "displayName": "My Widget",
              "description": "A sample home screen widget",
              "ios": {
                "supportedFamilies": ["systemSmall", "systemMedium", "systemLarge"]
              }
            }
          ]
        }
      ]
    ]
  }
}
```

| 属性 | 默认值 | 说明 |
| --- | --- | --- |
| `bundleIdentifier` | `"<app bundle identifier>.ExpoWidgetsTarget"` | 小组件扩展目标的 bundle identifier。未指定时默认为 `<主应用 bundle identifier>.ExpoWidgetsTarget`。 |
| `groupIdentifier` | `"group.<app bundle identifier>"` | 用于主应用与小组件之间通信和数据共享的 App Group 标识符，小组件必须有它才能工作。未指定时默认为 `group.<主应用 bundle identifier>`。若 `ios.bundleIdentifier` 也未设置，预构建会失败，因为派生该值需要 bundle identifier。 |
| `enablePushNotifications` | `false` | 是否为 Live Activities 启用推送通知。启用后会添加 `aps-environment` 权限，并在 **Info.plist** 中设置 `ExpoLiveActivity_EnablePushNotifications`。 |
| `widgets` |  | 小组件配置数组。数组中的每个小组件都会在小组件扩展中生成为单独的 widget kind。 |
| `widgets[].name` |  | 小组件的内部名称（标识符）。用作 Swift 结构体名，应为合法的 Swift 标识符（不含空格或特殊字符）。必须与传给 `createWidget` 的 `name` 一致。 |
| `widgets[].displayName` |  | 面向用户的小组件名称，用户把小组件添加到主屏幕时会显示在小组件库中。 |
| `widgets[].description` |  | 小组件作用的简短说明。显示在小组件库中，帮助用户理解用途。 |
| `widgets[].ios.supportedFamilies` |  | 此小组件支持的尺寸数组。可用选项：<br>* `systemSmall` - 小方形小组件（2x2 网格）<br>* `systemMedium` - 中等矩形小组件（4x2 网格）<br>* `systemLarge` - 大方形小组件（4x4 网格）<br>* `systemExtraLarge` - 超大小组件（仅 iPad，6x4 网格）<br>* `accessoryCircular` - 锁屏圆形小组件<br>* `accessoryRectangular` - 锁屏矩形小组件<br>* `accessoryInline` - 锁屏行内文本小组件 |
| `widgets[].ios.contentMarginsDisabled` | `false` | 禁用小组件内容边距后，系统不会自动在内容周围添加边距，你需要为每种上下文自行指定小组件内容周围的边距和内边距。 |
| `widgets[].ios.initialLayout` |  | 用 `createWidget` 注册此小组件的文件路径。路径相对于项目根目录。设置后，应用首次打开之前小组件就会出现在小组件库中。 |
| `widgets[].ios.configuration` |  | 使小组件[可配置](#可配置小组件)。用户选择的值会在运行时通过 `environment.configuration` 传给小组件。对象包含：<br>* `title` - 用户编辑小组件时显示的标题。<br>* `description` - 用户编辑小组件时显示的可选说明。<br>* `parameters` - 参数键到参数定义的映射。每个参数有 `title`、`type`（`string`、`number`、`boolean` 或 `enum`）和 `default`。`enum` 参数另外接受 `{ name, value }` 选项的 `values` 数组，并可设置 `dynamic: true`，让应用在运行时替换这些选项。 |

:::note
顶层的 `supportedFamilies` 和 `contentMarginsDisabled` 选项是 `ios.supportedFamilies` 和 `ios.contentMarginsDisabled` 的已弃用别名。请优先使用上面展示的嵌套 `ios` 形式。
:::

### 包含全部选项的完整示例

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-widgets",
        {
          "bundleIdentifier": "com.example.myapp.widgets",
          "groupIdentifier": "group.com.example.myapp",
          "enablePushNotifications": true,
          "widgets": [
            {
              "name": "StatusWidget",
              "displayName": "Status",
              "description": "Shows your current status at a glance",
              "ios": {
                "contentMarginsDisabled": true,
                "supportedFamilies": ["systemSmall", "systemMedium"]
              }
            },
            {
              "name": "WeatherWidget",
              "displayName": "Weather",
              "description": "Shows the weather for a city you choose",
              "ios": {
                "supportedFamilies": ["systemSmall", "systemMedium"],
                "configuration": {
                  "title": "Choose a city",
                  "description": "Pick which city to show the weather for",
                  "parameters": {
                    "city": {
                      "title": "City",
                      "type": "enum",
                      "default": "sf",
                      "values": [
                        { "name": "San Francisco", "value": "sf" },
                        { "name": "New York", "value": "nyc" }
                      ],
                      "dynamic": true
                    }
                  }
                }
              }
            },
            {
              "name": "LockScreenWidget",
              "displayName": "Quick View",
              "description": "View info on your Lock Screen",
              "ios": {
                "supportedFamilies": [
                  "accessoryCircular",
                  "accessoryRectangular",
                  "accessoryInline"
                ]
              }
            }
          ]
        }
      ]
    ]
  }
}
```

## 用法

### widget 指令

传给 `createWidget` 和 `createLiveActivity` 的组件必须以 `'widget'` 指令开头。该指令告诉打包器把这个组件编译成单独的 JavaScript 包，运行在小组件扩展内的隔离运行时中，而不是应用的 React Native 运行时。

由于这种隔离，标有 `'widget'` 的组件内的代码受到限制：

- 只能渲染 [`@expo/ui/swift-ui`](/versions/latest/sdk/ui/swift-ui) 组件和修饰符。标准 React Native 组件（例如 `react-native` 的 `View` 和 `Text`）不可用。
- 不能使用 React hooks（`useState`、`useEffect` 等）、组件状态或 context。函数必须是纯函数，并同步返回布局。
- 不能做异步工作、导入其他模块，或访问应用的运行时或内存中的状态。
- 不能引用组件函数之外声明的任何东西，包括**同一文件**中普通的顶层 `const`。打包器只序列化函数体，因此模块作用域的值在运行时不存在。每个常量和辅助函数都要声明在小组件函数**内部**，或通过 props 传入。

小组件需要的全部数据都必须通过 props（用 `updateSnapshot`、`updateTimeline`，或 Live Activity 的 `start` 和 `update` 设置）和 `environment` 参数传入。要使用图片，从应用把它们写入 [`widgetsDirectory`](#用-widgetsdirectory-共享图片)，再按路径引用。

```tsx
import { Text } from '@expo/ui/swift-ui';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

// 声明在模块作用域——不会打进小组件包。
const CITY_NAMES: Record<string, string> = { sf: 'San Francisco' };

const CityWidget = (props: object, environment: WidgetEnvironment<{ city: string }>) => {
  'widget';
  // 运行时会抛错：Can't find variable: CITY_NAMES
  return <Text>{CITY_NAMES[environment.configuration.city]}</Text>;
};

export default createWidget('CityWidget', CityWidget);
```

把 `CITY_NAMES` 移到 `CityWidget` 内部（或通过 props 传入已解析的值）即可修复。

### 小组件

#### 前提：创建小组件

先用 `createWidget` 函数创建小组件，并传入标有 `'widget'` 指令的小组件组件。组件的第一个参数是小组件 props，第二个参数是 `WidgetEnvironment` 对象。

```tsx
import { Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle } from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

type MyWidgetProps = {
  count: number;
};

const MyWidget = (props: MyWidgetProps, environment: WidgetEnvironment) => {
  'widget';
  return (
    <VStack>
      <Text modifiers={[font({ weight: 'bold', size: 16 }), foregroundStyle('#000000')]}>
        Count: {props.count}
      </Text>
      <Text>Family: {environment.widgetFamily}</Text>
    </VStack>
  );
};

export default createWidget('MyWidget', MyWidget, { count: 0 });
```

小组件名称（`'MyWidget'`）必须与[应用配置](/workflow/configuration)中小组件配置的 `name` 字段一致。
可选的第三个参数提供时间线更新之前使用的初始 props。

#### 基本小组件

更新小组件的有效方式是使用 `updateSnapshot` 方法。它会创建只含一条、立即显示的小组件时间线。

下面的示例承接[创建小组件](#前提创建小组件)。

```tsx
import MyWidget from './MyWidget';

// 更新小组件
MyWidget.updateSnapshot({ count: 5 });
```

#### 时间线小组件

使用 `updateTimeline` 方法在特定时间安排小组件更新。系统会根据时间线自动更新小组件。

下面的示例承接[创建小组件](#前提创建小组件)。

```tsx
import MyWidget from './MyWidget';

MyWidget.updateTimeline([
  { date: new Date(), props: { count: 1 } },
  { date: new Date(Date.now() + 3600000), props: { count: 2 } }, // 从现在起 1 小时
  { date: new Date(Date.now() + 7200000), props: { count: 3 } }, // 从现在起 2 小时
  { date: new Date(Date.now() + 10800000), props: { count: 4 } }, // 从现在起 3 小时
]);
```

#### 读取当前时间线

使用 `getTimeline` 读取小组件当前已安排的条目，包括过去和未来的条目。

```tsx
import MyWidget from './MyWidget';

const entries = await MyWidget.getTimeline();
// [{ date: Date, props: { count: number } }, ...]
```

#### 重新加载小组件

使用 `reload` 强制系统立即刷新小组件的内容和时间线，例如在底层数据变化之后。

```tsx
import MyWidget from './MyWidget';

MyWidget.reload();
```

#### 响应式小组件

使用 `environment` 参数，让布局适应当前小组件尺寸和渲染上下文。

```tsx
import { HStack, Text, VStack } from '@expo/ui/swift-ui';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

type WeatherWidgetProps = {
  temperature: number;
  condition: string;
};

const WeatherWidget = (props: WeatherWidgetProps, environment: WidgetEnvironment) => {
  'widget';
  // 按尺寸渲染不同布局
  if (environment.widgetFamily === 'systemSmall') {
    return (
      <VStack>
        <Text>{props.temperature}°</Text>
      </VStack>
    );
  }

  if (environment.widgetFamily === 'systemMedium') {
    return (
      <HStack>
        <Text>{props.temperature}°</Text>
        <Text>{props.condition}</Text>
      </HStack>
    );
  }

  // systemLarge 及其他尺寸
  return (
    <VStack>
      <Text>Temperature: {props.temperature}°</Text>
      <Text>Condition: {props.condition}</Text>
      <Text>Updated: {environment.date.toLocaleTimeString()}</Text>
    </VStack>
  );
};

const Widget = createWidget('WeatherWidget', WeatherWidget);
export default Widget;

Widget.updateSnapshot({
  temperature: 72,
  condition: 'Sunny',
});
```

#### 适应渲染环境

除了 `widgetFamily` 和 `date`，`environment` 对象还描述系统正在如何、在何处绘制小组件，以便你调整布局：

- `colorScheme`：`'light'` 或 `'dark'`。
- `widgetRenderingMode`：主屏幕小组件为 `'fullColor'`，锁屏小组件为 `'vibrant'`（系统会去饱和，变成自适应的单色外观），iOS 18 及更高版本的着色小组件为 `'accented'`。用它为每种模式选择清晰可读的颜色。
- `isLuminanceReduced`：显示需要降低亮度时（例如 Always-On）为 `true`。降低内容的整体亮度，例如用描边形状代替填充形状。
- `widgetContentMargins`：未禁用内容边距时，系统建议的边距（`top`、`bottom`、`leading`、`trailing`）。
- `showsWidgetLabel`：对附属小组件，是否可以显示附属标签。

#### 交互式小组件

小组件可以包含 `Button` 等交互控件。按钮 `onPress` 回调的返回值会成为小组件的新 props。运行时会把它持久化，并在设备上重新加载小组件，不需要正在运行的应用进程。这是让小组件响应点击并自行更新的主要方式。交互式小组件需要 iOS 17 或更高版本。

```tsx CounterWidget.tsx
import { Button, Text, VStack } from '@expo/ui/swift-ui';
import { createWidget } from 'expo-widgets';

type CounterProps = {
  count: number;
};

const CounterWidget = (props: CounterProps) => {
  'widget';
  return (
    <VStack>
      <Text>Count: {props.count}</Text>
      <Button label="Increment" target="increment" onPress={() => ({ count: props.count + 1 })} />
    </VStack>
  );
};

export default createWidget('CounterWidget', CounterWidget, { count: 0 });
```

若还要让正在运行的应用与小组件交互保持同步，给控件一个 `target` 标识符（如上），并用 `addUserInteractionListener` 监听点击。监听器收到小组件的 `name` 作为 `source`，以及控件的 `target`。与 `onPress` 不同，它只在应用进程存活时触发，因此用来把交互镜像到应用状态，而不是作为小组件的更新机制。

```tsx App.tsx
import { addUserInteractionListener } from 'expo-widgets';

const subscription = addUserInteractionListener(event => {
  if (event.source === 'CounterWidget' && event.target === 'increment') {
    // 小组件已通过 onPress 自行更新；在这里把变化同步到应用状态。
    console.log('Counter incremented from the widget');
  }
});

// 之后，当不再需要更新时：
subscription.remove();
```

#### 用 widgetsDirectory 共享图片

小组件无法访问应用沙盒内的文件，因此要在小组件中显示图片，必须把它放到共享的 App Group 容器中。`widgetsDirectory` 是指向应用和小组件都能读取的目录的 `file://` URL 字符串。从应用把图片写到那里，再在小组件中按路径引用。

```tsx
import { widgetsDirectory } from 'expo-widgets';

// `widgetsDirectory` 是指向与小组件共享目录的 file:// URL。
console.log(widgetsDirectory);
```

:::note
只有未配置 App Group 时，`widgetsDirectory` 才为 `null`。配置插件的 `groupIdentifier` 选项会自动设置一个（回退为 `group.<bundle identifier>`），因此正常使用时它是可用的。
:::

#### 可配置小组件

为小组件添加 [`ios.configuration`](#在应用配置中配置) 后，用户可以长按小组件并编辑其参数。他们选择的值会通过 `environment.configuration` 传给小组件。给 `createWidget`（以及 `WidgetEnvironment`）传入第二个类型参数来标注配置的类型。可配置小组件需要 iOS 17 或更高版本。

```tsx
import { Text, VStack } from '@expo/ui/swift-ui';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

type WeatherProps = {
  temperature: number;
};

type WeatherConfiguration = {
  city: string;
};

const WeatherWidget = (
  props: WeatherProps,
  environment: WidgetEnvironment<WeatherConfiguration>
) => {
  'widget';
  return (
    <VStack>
      <Text>{environment.configuration.city}</Text>
      <Text>{props.temperature}°</Text>
    </VStack>
  );
};

export default createWidget<WeatherProps, WeatherConfiguration>('WeatherWidget', WeatherWidget);
```

#### 动态枚举选项

当选项列表只在运行时才知道时（例如登录后加载的工作区），在[应用配置](#在应用配置中配置)里把枚举参数的 `dynamic` 设为 `true`。在应用按下例提供运行时选项之前，应用配置中的 `values` 数组用作回退列表：

```tsx
WeatherWidget.setConfigurationParameterEnum('city', [
  { name: 'Current City', value: 'current' },
  { name: 'San Francisco', value: 'sf' },
  { name: 'New York', value: 'nyc' },
]);
```

### Live Activities

Live Activities 在受支持的设备上，于锁屏和灵动岛中显示实时信息。

#### 前提：创建 Live Activity

Live Activity 布局必须用 `createLiveActivity` 创建一次，并标有 `'widget'` 指令。组件的第一个参数是 props，第二个参数是 `LiveActivityEnvironment` 对象。它返回一个对象，描述每种呈现方式的布局：锁屏 `banner`、紧凑和最小的灵动岛状态，以及展开的灵动岛区域。

:::warning
`createLiveActivity` 完全在运行时注册 Live Activity，并由库内置的 Live Activity 目标渲染它。**不要**在[应用配置](#在应用配置中配置)里为它添加 `widgets[]` 条目。`widgets[]` 数组只用于主屏幕和锁屏小组件，没有 `supportedFamilies` 的条目会生成无效的小组件目标并导致构建失败。传给 `createLiveActivity` 的 `name` 只需要与这次 `createLiveActivity` 调用一致，不必对应应用配置中的小组件。
:::

```tsx
import { Image, Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle, padding } from '@expo/ui/swift-ui/modifiers';
import { createLiveActivity, type LiveActivityEnvironment } from 'expo-widgets';

type DeliveryActivityProps = {
  etaMinutes: number;
  status: string;
};

const DeliveryActivity = (props: DeliveryActivityProps, environment: LiveActivityEnvironment) => {
  'widget';
  const accentColor = environment.isLuminanceReduced ? '#FFFFFF' : '#007AFF';

  return {
    banner: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Text modifiers={[font({ weight: 'bold' }), foregroundStyle(accentColor)]}>
          {props.status}
        </Text>
        <Text>Estimated arrival: {props.etaMinutes} minutes</Text>
      </VStack>
    ),
    compactLeading: <Image systemName="box.truck.fill" color={accentColor} />,
    compactTrailing: <Text>{props.etaMinutes} min</Text>,
    minimal: <Image systemName="box.truck.fill" color={accentColor} />,
    expandedLeading: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Image systemName="box.truck.fill" color={accentColor} />
        <Text modifiers={[font({ size: 12 })]}>Delivering</Text>
      </VStack>
    ),
    expandedTrailing: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Text modifiers={[font({ weight: 'bold', size: 20 })]}>{props.etaMinutes}</Text>
        <Text modifiers={[font({ size: 12 })]}>minutes</Text>
      </VStack>
    ),
    expandedBottom: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Text>Driver: John Smith</Text>
        <Text>Order #12345</Text>
      </VStack>
    ),
  };
};

export default createLiveActivity('DeliveryActivity', DeliveryActivity);
```

布局对象支持这些区域：

- `banner`：主要的锁屏呈现。
- `bannerSmall`：用于 CarPlay 和 watchOS 的紧凑锁屏呈现。省略时回退到 `banner`。
- `compactLeading`、`compactTrailing`、`minimal`：紧凑和最小的灵动岛状态。
- `expandedLeading`、`expandedTrailing`、`expandedCenter`、`expandedBottom`：展开的灵动岛区域。

`environment` 对象还暴露 `isLuminanceReduced`、`isActivityFullscreen`、`isActivityUpdateReduced` 和 `activityFamily`，以便按当前呈现方式调整布局。

#### 启动 Live Activity

下面的示例承接[创建 Live Activity](#前提创建-live-activity)。

```tsx
import { Button, View } from 'react-native';
import DeliveryActivity from './DeliveryActivity';

function App() {
  const startDeliveryTracking = () => {
    // 启动 Live Activity
    const instance = DeliveryActivity.start(
      {
        etaMinutes: 15,
        status: 'Your delivery is on the way',
      },
      'myapp://deliveries/12345'
    );
    // 存储实例
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Start delivery tracking" onPress={startDeliveryTracking} />
    </View>
  );
}
export default App;
```

可选的第二个参数是与该 Live Activity 关联的 URL。用户点击该活动时，系统会用这个 URL 打开应用，因此可以用[链接](/linking/into-your-app)路由到相关屏幕（例如 Expo Router 的深层链接）。

#### 更新 Live Activity

下面的示例承接[启动 Live Activity](#启动-live-activity)。

```tsx
import { LiveActivity } from 'expo-widgets';

function updateDelivery(instance: LiveActivity<DeliveryActivityProps>) {
  instance.update({
    etaMinutes: 2,
    status: 'Delivery arriving soon!',
  });
}
```

#### 恢复活跃的 Live Activities

Live Activity 可以比启动它的应用进程活得更久。在工厂上使用 `getInstances` 获取该类型当前活跃的活动，例如在应用重新启动后更新或结束它们。

```tsx
import DeliveryActivity from './DeliveryActivity';

const activeInstances = DeliveryActivity.getInstances();

for (const instance of activeInstances) {
  await instance.update({ etaMinutes: 5, status: 'Almost there' });
}
```

#### 结束 Live Activity

使用 `end` 结束 Live Activity。可以选择关闭策略，可选地提供最终内容状态，并传入 `contentDate`，让系统忽略过期更新。

```tsx
import { after, type LiveActivity } from 'expo-widgets';

async function completeDelivery(instance: LiveActivity<DeliveryActivityProps>) {
  await instance.end(
    after(new Date(Date.now() + 15 * 60 * 1000)),
    {
      etaMinutes: 0,
      status: 'Delivered',
    },
    new Date()
  );
}
```

关闭策略也可以传入 `'default'` 或 `'immediate'`，而不用 `after(date)`。

#### 用推送通知远程更新

当 `enablePushNotifications` 为 `true` 时，可以通过 Apple 推送通知服务（APNs）从服务器远程更新 Live Activities。

- 使用 `addPushToStartTokenListener` 接收应用范围的 push-to-start 令牌，让服务器远程启动 Live Activity（需要 iOS 17.2 或更高版本）。
- 使用 `instance.getPushToken()` 或 `instance.addPushTokenListener()` 获取某个正在运行的 Live Activity 的令牌，让服务器向该活动发送更新。

```tsx
import { addPushToStartTokenListener } from 'expo-widgets';
import DeliveryActivity from './DeliveryActivity';

const pushToStartSubscription = addPushToStartTokenListener(event => {
  console.log('Push-to-start token:', event.activityPushToStartToken);
});

async function startDeliveryTracking() {
  const instance = DeliveryActivity.start({
    etaMinutes: 15,
    status: 'Your delivery is on the way',
  });

  const pushToken = await instance.getPushToken();
  console.log('Per-activity token:', pushToken);

  const subscription = instance.addPushTokenListener(event => {
    console.log('Updated push token:', event.activityId, event.pushToken);
  });

  // 之后，当不再需要更新时：
  subscription.remove();
}

// 之后，当不再需要更新时：
pushToStartSubscription.remove();
```

把令牌发给服务器并用它推送更新。通知必须使用 `liveactivity` 推送类型（`apns-push-type` 头），`apns-topic` 为 `<你的 bundle identifier>.push-type.liveactivity`。其 `aps` 载荷包含 `event`（`start`、`update` 或 `end`）、`timestamp`，以及与活动 props 匹配的 `content-state`。`content-state` 必须匹配 `expo-widgets` 使用的内部内容状态：把 `name` 设为传给 `createLiveActivity` 的名称，把 `props` 设为该活动 props 的 JSON 字符串。立即更新使用 `apns-priority: 10`，较低优先级更新使用 `apns-priority: 5`。`timestamp`、`dismissal-date` 以及其他 APNs 日期字段是以秒为单位的 Unix 时间戳。

要远程启动 Live Activity，向 push-to-start 令牌发送 `start` 事件：

```json
{
  "aps": {
    "timestamp": 1778832000,
    "event": "start",
    "attributes-type": "LiveActivityAttributes",
    "attributes": {},
    "content-state": {
      "name": "DeliveryActivity",
      "props": "{\"etaMinutes\":15,\"status\":\"Your delivery is on the way\"}"
    },
    "alert": {
      "title": "Delivery started",
      "body": "Your delivery is on the way"
    }
  }
}
```

远程启动需要 iOS 17.2 或更高版本。在 iOS 18 或更高版本上，若希望 APNs 为后续更新提供新的按活动令牌，请在 `aps` 载荷中加入 `input-push-token: 1`。

要远程更新 Live Activity，向该活动的按活动令牌发送 `update` 事件：

```json
{
  "aps": {
    "timestamp": 1778832300,
    "event": "update",
    "content-state": {
      "name": "DeliveryActivity",
      "props": "{\"etaMinutes\":2,\"status\":\"Delivery arriving soon!\"}"
    }
  }
}
```

要远程结束 Live Activity，发送带最终内容状态的 `end` 事件：

```json
{
  "aps": {
    "timestamp": 1778832600,
    "event": "end",
    "content-state": {
      "name": "DeliveryActivity",
      "props": "{\"etaMinutes\":0,\"status\":\"Delivered\"}"
    },
    "dismissal-date": 1778833200
  }
}
```

确切的载荷形状和请求头请遵循 Apple 的 [使用 ActivityKit 推送通知启动和更新 Live Activities](https://developer.apple.com/documentation/activitykit/starting-and-updating-live-activities-with-activitykit-push-notifications)。

## API

```tsx
import { createWidget, createLiveActivity } from 'expo-widgets';
```
