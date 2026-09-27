---
title: @react-native-community/netinfo
description: A cross-platform API that provides access to network information.
packageName: @react-native-community/netinfo
---

# @react-native-community/netinfo

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

`@react-native-community/netinfo` allows you to get information about connection type and connection quality.

## Installation

:::tabs
:::tab npm
```sh
npx expo install @react-native-community/netinfo
```
:::
:::tab yarn
```sh
yarn expo install @react-native-community/netinfo
```
:::
:::tab pnpm
```sh
pnpm expo install @react-native-community/netinfo
```
:::
:::tab bun
```sh
bun expo install @react-native-community/netinfo
```
:::
:::

## API

To import this library, use:

```js
import NetInfo from '@react-native-community/netinfo';
```

If you want to grab information about the network connection just once, you can use:

```js
NetInfo.fetch().then(state => {
  console.log('Connection type', state.type);
  console.log('Is connected?', state.isConnected);
});
```

Or, if you'd rather subscribe to updates about the network state (which then allows you to run code/perform actions anytime the network state changes) use:

```js
const unsubscribe = NetInfo.addEventListener(state => {
  console.log('Connection type', state.type);
  console.log('Is connected?', state.isConnected);
});

// To unsubscribe to these update, just use:
unsubscribe();
```

## Accessing the SSID

To access the `ssid` property (available under `state.details.ssid`), there are a few additional configuration steps:

- Request location permissions with [`Location.requestForegroundPermissionsAsync()`](/versions/latest/sdk/location#locationrequestforegroundpermissionsasync) or [`Location.requestBackgroundPermissionsAsync()`](/versions/latest/sdk/location#locationrequestbackgroundpermissionsasync).

### iOS only

- Add the `com.apple.developer.networking.wifi-info` entitlement to your **app.json** under `ios.entitlements`:

  

```json
    "ios": {
      "entitlements": {
        "com.apple.developer.networking.wifi-info": true
      }
    }
  
```

- Check the **Access Wi-Fi Information** box in your app's App Identifier, [which can be found here](https://developer.apple.com/account/resources/identifiers/list).
- Rebuild your app with [`eas build --platform ios`](/build/setup#run-a-build) or [`npx expo run:ios`](/more/expo-cli#compiling).

## Learn more

- [Visit official documentation](https://github.com/react-native-netinfo/react-native-netinfo)：Get full information on API and its usage.

