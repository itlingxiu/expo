---
title: ScreenOrientation
description: A universal library for managing a device's screen orientation.
packageName: expo-screen-orientation
---

# ScreenOrientation

> 支持平台：Android、iOS、Web、Expo Go。

Screen Orientation is defined as the orientation in which graphics are painted on the device. For example, the figure below has a device in a vertical and horizontal physical orientation, but a portrait screen orientation. For physical device orientation, see the orientation section of [Device Motion](/versions/latest/sdk/devicemotion).

![Portrait orientation in different physical orientations.](/static/images/screen-orientation-portrait.jpg)

On both Android and iOS platforms, changes to the screen orientation will override any system settings or user preferences. On Android, it is possible to change the screen orientation while taking the user's preferred orientation into account. On iOS, user and system settings are not accessible by the application and any changes to the screen orientation will override existing settings.

> Web has [limited support](https://caniuse.com/#feat=deviceorientation).

## Orientation locks on iOS 27 and later （iOS）

Starting in iOS 27, iPhone apps can be resized, for example in iPhone Mirroring on macOS or when running on an iPad. While an app is resizable, the system treats a supported orientation as a preference rather than a requirement. This has two consequences:

- `lockAsync` may have no effect. The system can refuse the request, and your app stays resizable.
- `getOrientationAsync` may not describe the shape of the window your app is drawing into. iPhone Mirroring always reports a portrait orientation regardless of the window's aspect ratio.

Design your screens to adapt to the space available to them instead of relying on a fixed orientation. In debug builds, this library logs a warning when the system refuses an orientation lock. Use those warnings to find the screens that still depend on a lock the platform no longer guarantees.

## Installation

:::tabs
:::tab npm
```sh
npx expo install expo-screen-orientation
```
:::
:::tab yarn
```sh
yarn expo install expo-screen-orientation
```
:::
:::tab pnpm
```sh
pnpm expo install expo-screen-orientation
```
:::
:::tab bun
```sh
bun expo install expo-screen-orientation
```
:::
:::

### Warning

Apple added support for _split view_ mode to iPads in iOS 9. This changed how the screen orientation is handled by the system. To put the matter shortly, for iOS, your iPad is always in landscape mode unless you open two applications side by side. To be able to lock screen orientation using this module you will need to disable support for this feature by setting [`ios.requireFullScreen`](/versions/latest/config/app#requirefullscreen) to `true` in your [app config](/workflow/configuration).

On iOS 27 and later, `requireFullScreen` no longer opts your app out of being resized, so it cannot reliably lock the screen orientation. See [Orientation locks on iOS 27 and later](#orientation-locks-on-ios-27-and-later). For more information about the _split view_ mode, check out [the official Apple documentation](https://support.apple.com/en-us/HT207582).

## Configuration in app config

You can configure `expo-screen-orientation` using its built-in [config plugin](/config-plugins/introduction) if you use config plugins in your project ([Continuous Native Generation (CNG)](/workflow/continuous-native-generation)). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect. If your app does **not** use CNG, then you'll need to manually configure the library.

### Example app.json with config plugin

```json
{
  "expo": {
    "ios": {
      "requireFullScreen": true
    },
    "plugins": [
      [
        "expo-screen-orientation",
        {
          "initialOrientation": "DEFAULT"
        }
      ]
    ]
  }
}
```

### Configurable properties

| Name | Default | Description |
| --- | --- | --- |
| `initialOrientation` | `undefined` | Only for: iOS. Sets the iOS initial screen orientation. Possible values: `DEFAULT`, `ALL`, `PORTRAIT`, `PORTRAIT_UP`, `PORTRAIT_DOWN`, `LANDSCAPE`, `LANDSCAPE_LEFT`, `LANDSCAPE_RIGHT` |

<details><summary>Are you using this library in an existing React Native app?</summary>

1. Open the **ios** directory in Xcode with `xed ios`. If you don't have the directory, run `npx expo prebuild -p ios` to generate one.
2. Tick the `Requires Full Screen` checkbox in Xcode. It should be located under **Project Target** > **General** > **Deployment Info**.

</details>

## Per-screen orientation with Expo Router

If you use [Expo Router](/router/introduction), you can set the orientation per screen using the `orientation` option on [`Stack.Screen`](/router/advanced/stack). This is powered by `react-native-screens` and is the recommended approach for per-screen orientation in stack navigators.

```tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ orientation: 'portrait' }} />
      <Stack.Screen name="landscape" options={{ orientation: 'landscape' }} />
    </Stack>
  );
}
```

## API

```js
import * as ScreenOrientation from 'expo-screen-orientation';
```

