---
title: Android Studio 模拟器
description: 了解如何设置 Android 模拟器，以便在虚拟 Android 设备上测试应用。
---

# Android Studio 模拟器

如果你没有可用于测试的 Android 设备，我们建议使用 Android Studio 自带的默认模拟器。如果设置过程中遇到问题，请按本指南中的步骤操作。

## 安装 JDK

:::tabs
:::tab macOS

#### 前提条件

使用 [Homebrew](https://brew.sh/) 等包管理器安装以下依赖。

#### 安装依赖

:::note
只有 SDK 55 及更早版本的项目才需要安装 Watchman。
:::

1. 使用 Homebrew 等工具[安装 Watchman](https://facebook.github.io/watchman/docs/install#macos)：

   ```sh
   $ brew install watchman
   ```

2. 使用 Homebrew 安装名为 Azul Zulu 的 OpenJDK 发行版。该发行版同时为 Apple Silicon 和 Intel Mac 提供 JDK。

   在终端中运行以下命令：

   ```sh
   $ brew install --cask zulu@17
   ```

   安装 JDK 后，在 **~/.bash_profile**（如果使用 Zsh，则为 **~/.zshrc**）中添加 `JAVA_HOME` 环境变量：

   ```bash
   export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
   ```

:::
:::tab Windows

#### 前提条件

使用 [Chocolatey](https://chocolatey.org/) 等包管理器安装以下依赖。

#### 安装依赖

安装 [Java SE Development Kit (JDK)](https://openjdk.org/)：

```sh
$ choco install -y microsoft-openjdk17
```

:::
:::tab Linux

#### 安装依赖

:::note
只有 SDK 55 及更早版本的项目才需要安装 Watchman。
:::

1. 按照 [Watchman 文档中的说明](https://facebook.github.io/watchman/docs/install#linux)从源码编译并安装它。

2. 安装 [Java SE Development Kit (JDK)](https://openjdk.org/)：

   你可以从 [AdoptOpenJDK](https://adoptopenjdk.net/) 或系统的包管理器下载并安装 [OpenJDK@17](http://openjdk.java.net/)。

:::
:::

## 设置 Android Studio

:::tabs
:::tab macOS

1. 下载并安装 [Android Studio](https://developer.android.com/studio)。

2. 打开 **Android Studio** 应用。首次启动时会出现 **Android Studio Setup Wizard**。在 **Welcome** 屏幕上点击 **Next**。然后在 **Install Type** 下选择 **Standard** 并点击 **Next**。

   ![Android Studio 安装向导询问安装类型。](/static/images/android-studio/install-type.webp)

   确认设置并点击 **Next**。然后接受许可协议并再次点击 **Next**。向导会下载并安装 Android SDK 及其工具。安装完成后点击 **Finish**。

3. 默认情况下，Android Studio 会安装最新版本的 Android SDK。不过，编译 React Native 应用需要 Android 16（`Baklava`）SDK。

   打开 Android Studio，前往 **Settings** > **Languages & Frameworks** > **Android SDK**。在 **SDK Platforms** 选项卡中，于 **Android 16 (`Baklava`)** 下选择 **Android SDK Platform 36** 和 **Sources for Android 36**。

   ![Android SDK 平台](/static/images/android-studio/sdk-platforms.webp)

4. 然后点击 **SDK Tools** 选项卡，确保至少安装了一个版本的 **Android SDK Build-Tools** 和 **Android Emulator**。

   ![Android SDK 构建工具。](/static/images/android-studio/build-tools.webp)

5. 复制或记住标有 **Android SDK Location** 的框中列出的路径。

   ![Android SDK 位置](/static/images/android-studio/sdk-location.webp)

6. 把以下行添加到 **/.zprofile** 或 **~/.zshrc**（如果使用 bash，则为 **~/.bash_profile** 或 **~/.bashrc**）配置文件：

   ```sh
   $ export ANDROID_HOME=$HOME/Library/Android/sdk
   $ export PATH=$PATH:$ANDROID_HOME/emulator
   $ export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

7. 在当前 shell 中重新加载路径环境变量：

   ```sh
   # 适用于 zsh
   $ source $HOME/.zshrc

   # 适用于 bash
   $ source $HOME/.bashrc
   ```

8. 最后，确认你可以从终端运行 `adb`。

   <details>
   <summary>故障排查：Android Studio 无法识别 JDK</summary>

   如果 Android Studio 无法识别通过 Homebrew 安装的 JDK，可以创建 Gradle 配置文件来显式设置 Java 路径：

   1. 在主目录中创建 Gradle 属性文件：

      ```sh
      $ touch ~/.gradle/gradle.properties
      ```

   2. 把以下行添加到 **gradle.properties** 文件，并把路径替换为实际的 Java 安装路径：

      ```bash gradle.properties
      java.home=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
      ```

   3. 如果项目目录中已有 `.gradle` 文件夹，删除它并在 Android Studio 中重新打开项目：

      ```sh
      $ rm -rf .gradle
      ```

   这应能解决 Android Studio 检测不到 JDK 安装的问题。

   </details>

:::
:::tab Windows

1. 下载 [Android Studio](https://developer.android.com/studio)。

2. 打开 **Android Studio Setup**。在 **Select components to install** 下选择 Android Studio 和 Android Virtual Device。然后点击 **Next**。

3. 在 Android Studio Setup Wizard 中，于 **Install Type** 下选择 **Standard** 并点击 **Next**。

   ![Android Studio 安装向导询问安装类型。](/static/images/android-studio/windows-install-type.webp)

4. Android Studio Setup Wizard 会要求你确认设置，例如 Android SDK、platform-tools 的版本等。确认后点击 **Next**。

5. 在下一个窗口中，接受所有可用组件的许可。

   ![Android Studio 安装向导要求接受各项许可以安装工具。](/static/images/android-studio/windows-licenses.webp)

6. 默认情况下，Android Studio 会安装最新版本的 Android SDK。不过，编译 React Native 应用需要 Android 16（`Baklava`）SDK。

   打开 Android Studio，前往 **Settings** > **Languages & Frameworks** > **Android SDK**。在 **SDK Platforms** 选项卡中，于 **Android 16 (`Baklava`)** 下选择 **Android SDK Platform 36** 和 **Sources for Android 36**。

   ![Android SDK 平台](/static/images/android-studio/windows-sdk-platforms.webp)

7. 然后点击 **SDK Tools** 选项卡，确保至少安装了一个版本的 **Android SDK Build-Tools** 和 **Android Emulator**。

   ![Android SDK 构建工具](/static/images/android-studio/windows-build-tools.webp)

8. 工具安装完成后，配置 `ANDROID_HOME` 环境变量。前往 **Windows 控制面板** > **用户账户** > **用户账户**（再次进入）> **更改我的环境变量**，点击 **新建** 以创建新的 `ANDROID_HOME` 用户变量。该变量的值指向你的 Android SDK 路径：

   ![设置 ANDROID_HOME 用户变量。](/static/images/android-studio/windows-android-home-variable.webp)

   <details>
   <summary>如何找到已安装的 SDK 位置？</summary>

   默认情况下，Android SDK 安装在以下位置：

   ```bash
   %LOCALAPPDATA%\Android\Sdk
   ```

   要在 Android Studio 中手动查找 SDK 位置，前往 **Settings** > **Languages & Frameworks** > **Android SDK**。查看 **Android SDK Location** 旁边的位置。

   ![Android Studio 设置中的 Android SDK 位置。](/static/images/android-studio/windows-android-sdk-location.webp)

   </details>

9. 要验证新环境变量已加载，打开 **PowerShell**，复制并粘贴以下命令：

   ```sh
   $ Get-ChildItem -Path Env:
   ```

   该命令会输出所有用户环境变量。在此列表中查看是否已添加 `ANDROID_HOME`。

10. 要把 platform-tools 添加到 Path，前往 **Windows 控制面板** > **用户账户** > **用户账户**（再次进入）> **更改我的环境变量** > **Path** > **编辑** > **新建**，并如下所示把 platform-tools 的路径添加到列表：

    ![设置 platform-tools 用户变量。](/static/images/android-studio/windows-platform-tools-path.webp)

    <details>
    <summary>如何找到已安装的 platform-tools 位置</summary>

    默认情况下，platform-tools 安装在以下位置：

    ```bash
    %LOCALAPPDATA%\Android\Sdk\platform-tools
    ```

    </details>

11. 最后，确认你可以从 PowerShell 运行 `adb`。例如，运行 `adb --version` 查看系统正在运行的 `adb` 版本。

:::
:::

## 设置模拟器

1. 在 Android Studio 主屏幕上，点击 **More Actions**，然后在下拉菜单中点击 **Virtual Device Manager**。

   ![Android Studio 配置。](/static/images/android-studio/virtual-device.webp)

2. 点击 **Create virtual device**。

   ![Android Studio 创建虚拟设备。](/static/images/android-studio/create-device.webp)

3. 在 **Add device** 下，选择你想模拟的硬件类型。我们建议针对多种设备进行测试，但如果你不确定从哪里开始，Pixel 系列中最新的设备可能是不错的选择。

   ![Android Studio 创建虚拟设备时的硬件选择。](/static/images/android-studio/select-hardware.webp)

4. 选择要加载到模拟器上的操作系统版本（通常是某个系统镜像），并下载该镜像（如果需要）。

   ![Android Studio 创建虚拟设备时的操作系统选择。](/static/images/android-studio/select-os.webp)

5. 按你的需要更改其他设置，然后按 **Finish** 创建模拟器。之后你可以随时在 **Device Manager** 窗口中按播放按钮来运行此模拟器。

## 故障排查

### 存在多个 `adb` 版本

系统上存在多个 `adb` 版本时，可能导致以下错误：

```sh
$ adb server version (xx) doesn't match this client (xx); killing...
```

这是因为系统上的 `adb` 版本与 Android SDK platform-tools 中的 `adb` 版本不同。

1. 打开终端，检查系统上的 `adb` 版本：

   ```sh
   $ adb version
   ```

2. 再从 Android SDK platform-tools 目录检查：

   ```sh
   $ cd ~/Library/Android/sdk/platform-tools
   $ ./adb version
   ```

3. 把 Android SDK 目录中的 `adb` 复制到 `usr/bin` 目录：

   ```sh
   $ sudo cp ~/Library/Android/sdk/platform-tools/adb /usr/bin
   ```

### 如何安装特定版本的 Expo Go？

你可以创建所需 SDK 版本的项目，并在模拟器中打开它，以安装匹配版本的 Expo Go。

:::tabs
:::tab npm
```sh
# 引导一个 SDK 57 项目
$ npx create-expo-app --template blank@57

# 在模拟器上打开应用，以安装所需的 Expo Go 应用
$ npx expo start --android
```
:::
:::tab yarn
```sh
# 引导一个 SDK 57 项目
$ yarn create expo-app --template blank@57

# 在模拟器上打开应用，以安装所需的 Expo Go 应用
$ yarn expo start --android
```
:::
:::tab pnpm
```sh
# 引导一个 SDK 57 项目
$ pnpm create expo-app --template blank@57

# 在模拟器上打开应用，以安装所需的 Expo Go 应用
$ pnpm expo start --android
```
:::
:::tab bun
```sh
# 引导一个 SDK 57 项目
$ bun create expo --template blank@57

# 在模拟器上打开应用，以安装所需的 Expo Go 应用
$ bun expo start --android
```
:::
:::

也可以使用 [`expo-go` CLI](https://www.npmjs.com/package/expo-go) 下载特定版本的 Expo Go：传入 SDK 版本，或使用 `latest` 表示最新 SDK 版本。此命令会把 Expo Go 应用下载到当前目录，并缓存在 **~/.expo** 下。

:::tabs
:::tab npm
```sh
$ npx expo-go download android latest
```
:::
:::tab yarn
```sh
$ yarn dlx expo-go download android latest
```
:::
:::tab pnpm
```sh
$ pnpm dlx expo-go download android latest
```
:::
:::tab bun
```sh
$ bunx expo-go download android latest
```
:::
:::
