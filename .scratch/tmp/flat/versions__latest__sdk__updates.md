---
title: Updates
description: A library that enables your app to manage remote updates to your application code.
---

# Updates

> 支持平台：Android、iOS、tvOS、Expo Go。

`expo-updates` is a library that enables your app to manage remote updates to your application code. It communicates with the configured remote update service to get information about available updates.

## Installation

The `expo-updates` library can be automatically configured using [EAS Update](/eas-update/introduction), which is a hosted service that manages and serves updates to your app. To get started with EAS Update, follow the instructions in the [Get started](/eas-update/getting-started) guide.

Alternatively, it is also possible to configure the `expo-updates` library manually in cases where a different remote update service is required or configuration is only specified in native files.

<details>
<summary>Manual installation, configuration, and custom remote update services</summary>

:::tabs
:::tab npm
```sh
npx expo install expo-updates
```
:::
:::tab yarn
```sh
yarn expo install expo-updates
```
:::
:::tab pnpm
```sh
pnpm expo install expo-updates
```
:::
:::tab bun
```sh
bun expo install expo-updates
```
:::
:::

If you're installing this library in an [existing React Native project](/bare/overview) or a generic app with manually configured native code, follow these [installation instructions](/bare/installing-updates).

If using [app config](/workflow/configuration) for configuration, this library can be configured by setting at least the following app config properties:

- [`updates.url`](/versions/latest/config/app#updates): a URL of a remote service implementing the [Expo Updates protocol](/technical-specs/expo-updates-1)
- [`runtimeVersion`](/versions/latest/config/app#runtimeversion): a [runtime version](#runtime-version)

The remote service must implement the [Expo Updates protocol](/technical-specs/expo-updates-1). [EAS Update](/eas-update/introduction) is one such service, but it is also possible to use this library with a custom server.

[Custom Expo Updates Server](https://github.com/expo/custom-expo-updates-server)

Example implementation of a custom server and an app using that server.

</details>

## Configuration

There are build-time configuration options that control the behavior of the library. For most apps, these configuration values are set in the [app config](/workflow/configuration) under the [`updates` property](/versions/latest/config/app#updates).

| [App config property](/versions/latest/config/app#updates)                                       | Default   | Required?   | iOS plist/dictionary key               | Android meta-data name                                           | Android Map key               |
| ----------------------------------------------------------------------------------- | --------- | ----------- | -------------------------------------- | ---------------------------------------------------------------- | ----------------------------- |
| [`updates.enabled`](/versions/latest/config/app#enabled)                                         | `true`    | 否  | `EXUpdatesEnabled`                     | `expo.modules.updates.ENABLED`                                   | `enabled`                     |
| [`updates.url`](/versions/latest/config/app#url)                                                 | (none)    | 是 | `EXUpdatesURL`                         | `expo.modules.updates.EXPO_UPDATE_URL`                           | `updateUrl`                   |
| [`updates.requestHeaders`](/versions/latest/config/app#requestheaders)                           | (none)    | 否  | `EXUpdatesRequestHeaders`              | `expo.modules.updates.UPDATES_CONFIGURATION_REQUEST_HEADERS_KEY` | `requestHeaders`              |
| [`runtimeVersion`](/versions/latest/config/app#runtimeversion)                                   | (none)    | 是 | `EXUpdatesRuntimeVersion`              | `expo.modules.updates.EXPO_RUNTIME_VERSION`                      | `runtimeVersion`              |
| [`updates.checkAutomatically`](/versions/latest/config/app#checkautomatically)                   | `ON_LOAD` | 否  | `EXUpdatesCheckOnLaunch`               | `expo.modules.updates.EXPO_UPDATES_CHECK_ON_LAUNCH`              | `checkOnLaunch`               |
| [`updates.fallbackToCacheTimeout`](/versions/latest/config/app#fallbacktocachetimeout)           | `0`       | 否  | `EXUpdatesLaunchWaitMs`                | `expo.modules.updates.EXPO_UPDATES_LAUNCH_WAIT_MS`               | `launchWaitMs`                |
| [`updates.useEmbeddedUpdate`](/versions/latest/config/app#useembeddedupdate)                     | `true`    | 否  | `EXUpdatesHasEmbeddedUpdate`           | `expo.modules.updates.HAS_EMBEDDED_UPDATE`                       | `hasEmbeddedUpdate`           |
| [`updates.codeSigningCertificate`](/versions/latest/config/app#codesigningcertificate)           | (none)    | 否  | `EXUpdatesCodeSigningCertificate`      | `expo.modules.updates.CODE_SIGNING_CERTIFICATE`                  | `codeSigningCertificate`      |
| [`updates.codeSigningMetadata`](/versions/latest/config/app#codesigningmetadata)                 | (none)    | 否  | `EXUpdatesCodeSigningMetadata`         | `expo.modules.updates.CODE_SIGNING_METADATA`                     | `codeSigningMetadata`         |
| [`updates.assetPatternsToBeBundled`](/versions/latest/config/app#assetpatternstobebundled)       | (none)    | 否  | N/A                                    | N/A                                                              | N/A                           |
| [`updates.disableAntiBrickingMeasures`](/versions/latest/config/app#disableantibrickingmeasures) | `false`   | 否  | `EXUpdatesDisableAntiBrickingMeasures` | `expo.modules.updates.DISABLE_ANTI_BRICKING_MEASURES`            | `disableAntiBrickingMeasures` |
| [`updates.enableBsdiffPatchSupport`](/versions/latest/config/app#enablebsdiffpatchsupport)       | `true`    | 否  | `EXUpdatesEnableBsdiffPatchSupport`    | `expo.modules.updates.ENABLE_BSDIFF_PATCH_SUPPORT`               | `enableBsdiffPatchSupport`    |

The two core required configuration options are:

- [`updates.url`](/versions/latest/config/app#updates): the URL at which the library fetches remote updates
- [`runtimeVersion`](/versions/latest/config/app#runtimeversion): a [runtime version](#runtime-version)

These are configured automatically when following the EAS Update [Get started](/eas-update/getting-started) guide.

### Runtime version

Each time you build a binary for your app it includes the native code and configuration present at the time of the build as well as native configuration, and this unique combination is represented by a string called a runtime version. A remote update targets one runtime version, indicating that only binaries with a matching runtime version can load the remote update.

<details>
<summary>Manual configuration</summary>

The runtime version can be managed manually by setting the string value in the config field.

```json
{
  "expo": {
    "runtimeVersion": "<runtime_version_string>"
  }
}
```

</details>

<details>
<summary>Automatic configuration using runtime version policies</summary>

Runtime version policies derive the runtime version from another piece of information already present in your project. They can be set in the [`runtimeVersion`](/versions/latest/config/app#runtimeversion) config field as follows:

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "<policy_name>"
    }
  }
}
```

Available policy types:

<details>
<summary>appVersion</summary>

The `"appVersion"` policy is provided for projects with that wish to define their runtime compatibility based on the app version.

For example, in a project that has the following in its app config:

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "version": "1.0.0",
    "ios": {
      "buildNumber": "1"
    },
    "android": {
      "versionCode": 1
    }
  }
}
```

The `"appVersion"` policy will set the runtime version to the project's current `"version"` property. In this case, the runtime version for the Android and iOS builds and any updates would be `"1.0.0"`.

This policy is great for projects that contain custom native code and that update the `"version"` field after every public release. To submit an app, the app stores require an updated native version number for each submitted build, which makes this policy convenient if you want to be sure that every version installed on user devices has a different runtime version.

When using this policy, you need to manually update `"version"` field in the app config every time there is a public release, but for Play Store's Internal Test Track and the App Store's TestFlight uploads, you can rely on `"autoIncrement"` option in **eas.json** to [manage versions for you](/build-reference/app-versions#remote-version-source).

</details>

<details>
<summary>nativeVersion</summary>

The `"nativeVersion"` policy is provided for projects that wish to define their runtime compatibility based on the project's current `"version"` and `"versionCode"` (Android) or `"buildNumber"` (iOS) properties.

For example, in a project that has the following in its app config:

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "nativeVersion"
    },
    "version": "1.0.0",
    "ios": {
      "buildNumber": "1"
    },
    "android": {
      "versionCode": 1
    }
  }
}
```

The runtime version for the Android and iOS builds and any updates would be the combination of `"[version]([buildNumber|versionCode])"`, which in this case would be `"1.0.0(1)"`.

This policy is great for projects containing custom native code that update the native version numbers (`"buildNumber"` for iOS and `"versionCode"` for Android) for each build. To submit an app, the app stores require an updated native version number for each submitted build, which makes this policy convenient if you want to be sure that every app uploaded to the Play Store's Internal Test Track and the App Store's TestFlight distribution tools has a different `runtimeVersion`.

It's important to know that this policy requires management of the native version numbers manually between each build.

Also, if you select a different native version between Android and iOS, you'll end up with builds and updates with separate runtime versions.

</details>

<details>
<summary>fingerprint</summary>

The `"fingerprint"` runtime version policy automatically calculates the runtime version for you, including through changes like SDK upgrades or adding custom native code.

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "fingerprint"
    }
  }
}
```

This policy works for both projects with and without custom native code. It works by using the [`@expo/fingerprint`](fingerprint) package to calculate the hash of your project during builds and updates to determine build-update compatibility (also known as the runtime).

</details>

</details>

### Native configuration and overriding

If your project does not use Continuous Native Generation, these configuration values may also be set in your app's native configuration files or overridden during initialization in native code.

<details>
<summary>Native configuration instructions</summary>

On Android, these options are set as `meta-data` tags in the **AndroidManifest.xml** file (adjacent to the tags added during installation if auto-setup was used). You can also set or override them at runtime using `UpdatesController.overrideConfiguration()`.

On iOS, these properties are set as keys in the **Expo.plist** file. You can also set or override them at runtime by calling `AppController.overrideConfiguration`.

<details>
<summary>Importing Swift generated headers for use in Objective-C++</summary>

If your iOS native code or `AppDelegate.mm` is written in Objective-C++, you will need to add the following imports to reference methods on `EXUpdatesAppController`. This is only necessary for overriding configuration at runtime.

```objc
#import "ExpoModulesCore-Swift.h"
#import "EXUpdatesInterface-Swift.h"
#import "EXUpdates-Swift.h"
```

</details>

</details>

## Usage

By default, `expo-updates` checks for updates when the app launches. If an update is available, it downloads the update and applies it the next time the app is restarted. You can tune this startup behavior using the `checkAutomatically` and `fallbackToCacheTimeout` configuration options above.

The library also provides a variety of constants to inspect the current update and functions to customize update behavior from your application code (after startup). For example, one common alternative usage pattern is to manually check for updates after the app has started instead of doing the default check on launch.

<details>
<summary>Example: Check for updates manually</summary>

You can configure your app to check for updates manually by doing the following steps:

1. Set the `checkAutomatically` configuration value to `ON_ERROR_RECOVERY` or `NEVER` to disable the library's default launch behavior.
2. Add the following code to check for available updates, download them, and reload:

   ```jsx App.js
      import { View, Button } from 'react-native';
      import * as Updates from 'expo-updates';

      function App() {
        async function onFetchUpdateAsync() {
          try {
            const update = await Updates.checkForUpdateAsync();

            if (update.isAvailable) {
              await Updates.fetchUpdateAsync();
              await Updates.reloadAsync();
            }
          } catch (error) {
            // 获取更新出错时，也可以加一个 alert() 来查看错误信息。
            alert(`Error fetching latest Expo update: ${error}`);
          }
        }

        return (
          <View>
            <Button title="Fetch update" onPress={onFetchUpdateAsync} />
          </View>
        );
      }
      ```

</details>

## Testing

Most of the methods and constants in this library can be used or tested only in release builds. In debug builds, the default behavior is to always load the latest JavaScript from a development server. It is possible to [build a debug version of your app with the same updates behavior as a release build](/eas-update/debug#debugging-of-native-code-while-loading-the-app-through-expo-updates). Such an app will not open the latest JavaScript from your development server — it will load published updates just as a release build does. This may be useful for debugging the behavior of your app when it is not connected to a development server.

**To test the content of an update in a development build**, run [`eas update`](/eas-update/getting-started) and then browse to the update in your development build. Note that this only simulates what an update will look like in your app, and most of the [Updates API](#api) is unavailable when running in a development build.

**To test updates in a release build**, you can create a [**.apk**](/build-reference/apk) or a [simulator build](/build-reference/simulators), or make a release build locally with `npx expo run:android --variant release` and `npx expo run:ios --configuration Release` (you don't need to submit this build to the store to test). The full [Updates API](#api) is available in a release build.

**To test the content of an update in Expo Go**, run [`eas update`](/eas-update/getting-started) and then browse to the update in Expo Go. Note that this only simulates what an update will look like in your app, and most of the [Updates API](#api) is unavailable when running in Expo Go. Also note that only updates using [Expo Go-compatible libraries](/workflow/using-libraries#determining-third-party-library-compatibility) are supported.

## API

```js
import * as Updates from 'expo-updates';
```

## Error codes

| Code                              | Description                                                                                                                                                                                                                                                                |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ERR_UPDATES_DISABLED`            | A method call was attempted when the Updates library was disabled, or the application was running in development mode                                                                                                                                                      |
| `ERR_UPDATES_RELOAD`              | An error occurred when trying to reload the application and it could not be reloaded. For existing React Native projects, double-check the setup steps for this library to ensure it has been installed correctly and the proper native initialization methods are called. |
| `ERR_UPDATES_CHECK`               | An unexpected error occurred when trying to check for new updates. Check the error message for more information.                                                                                                                                                           |
| `ERR_UPDATES_FETCH`               | An unexpected error occurred when trying to fetch a new update. Check the error message for more information.                                                                                                                                                              |
| `ERR_UPDATES_READ_LOGS`           | An unexpected error occurred when trying to read log entries. Check the error message for more information.                                                                                                                                                                |
| `ERR_NOT_AVAILABLE_IN_DEV_CLIENT` | A method is not available when running in a development build. A release build should be used to test this method.                                                                                                                                                         |
