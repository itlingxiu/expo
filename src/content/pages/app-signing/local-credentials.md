---
title: 使用本地凭据
description: 了解使用 EAS 时如何配置并使用本地凭据。
---

# 使用本地凭据

通常你可以[让 EAS 代为处理](/app-signing/managed-credentials)，而不必成为代码签名专家。不过，有些用户希望自行管理项目的密钥库、证书和描述文件。

如果想自行管理应用签名凭据，可以用 **credentials.json** 告诉 EAS Build 本地文件系统上凭据的相对路径及其密码，以便用它们为构建签名。

## credentials.json

如果选择本地凭据配置，需要在项目根目录创建 **credentials.json** 文件，内容大致如下：

```json credentials.json
{
  "android": {
    "keystore": {
      "keystorePath": "android/keystores/release.keystore",
      "keystorePassword": "paofohlooZ9e",
      "keyAlias": "keyalias",
      "keyPassword": "aew1Geuthoev"
    }
  },
  "ios": {
    "provisioningProfilePath": "ios/certs/profile.mobileprovision",
    "distributionCertificate": {
      "path": "ios/certs/dist-cert.p12",
      "password": "iex3shi9Lohl"
    }
  }
}
```

> 记得把 **credentials.json** 和所有凭据加入 **.gitignore**，以免意外提交到仓库并可能泄露密钥。

### Android 凭据

要构建 Android 应用二进制文件，需要一个密钥库。如果还没有发布密钥库，可以用下面的命令自行生成（把 `KEYSTORE_PASSWORD`、`KEY_PASSWORD`、`KEY_ALIAS` 和 `com.expo.your.android.package` 替换成你选择的值）：

```sh
keytool -genkey -v -storetype JKS -keyalg RSA -keysize 2048 -validity 10000 -storepass KEYSTORE_PASSWORD -keypass KEY_PASSWORD -alias KEY_ALIAS -keystore release.keystore -dname "CN=com.expo.your.android.package,OU=,O=,L=,S=,C=US"
```

计算机上有了密钥库文件后，应把它移到合适的目录。建议把密钥库放在 **android/keystores** 目录中。**记得把所有发布密钥库加入 git 忽略！** 如果已经运行上面的 keytool 命令，并把密钥库放在 **android/keystores/release.keystore**，可以在 **.gitignore** 中加入下面这一行来忽略该文件：

```sh .gitignore
android/keystores/release.keystore
```

创建 **credentials.json** 并用凭据配置它：

```json credentials.json
{
  "android": {
    "keystore": {
      "keystorePath": "android/keystores/release.keystore",
      "keystorePassword": "KEYSTORE_PASSWORD",
      "keyAlias": "KEY_ALIAS",
      "keyPassword": "KEY_PASSWORD"
    }
  },
  "ios": {
    // ...
  }
}
```

- `keystorePath` 指向密钥库在计算机上的位置。支持相对路径（相对于项目根目录）和绝对路径。
- `keystorePassword` 是密钥库密码。如果遵循了前面的步骤，它就是 `KEYSTORE_PASSWORD` 的值。
- `keyAlias` 是密钥别名。如果遵循了前面的步骤，它就是 `KEY_ALIAS` 的值。
- `keyPassword` 是密钥密码。如果遵循了前面的步骤，它就是 `KEY_PASSWORD` 的值。

### iOS 凭据

构建 iOS 应用二进制文件还有一些前置条件。你需要付费的 Apple Developer 账户，然后为应用生成分发证书和描述文件，这可以在 [Apple Developer Portal](https://developer.apple.com/account/resources/certificates/list) 完成。

计算机上有了分发证书和描述文件后，应把它们移到合适的目录。建议放在 `ios/certs` 目录中。本文其余部分假设它们分别名为 **dist.p12** 和 **profile.mobileprovision**。

> 记得把存放凭据的目录加入 **.gitignore**，以免意外提交到仓库并可能泄露密钥。

如果把凭据放在建议的目录中，可以在 **.gitignore** 中加入下面这一行来忽略这些文件：

```sh .gitignore
ios/certs/*
```

创建（或编辑）**credentials.json** 并用凭据配置它：

```json credentials.json
{
  "android": {
    // ...
  },
  "ios": {
    "provisioningProfilePath": "ios/certs/profile.mobileprovision",
    "distributionCertificate": {
      "path": "ios/certs/dist.p12",
      "password": "DISTRIBUTION_CERTIFICATE_PASSWORD"
    }
  }
}
```

- `provisioningProfilePath` 指向描述文件在计算机上的位置。支持相对路径（相对于项目根目录）和绝对路径。
- `distributionCertificate.path` 指向分发证书在计算机上的位置。支持相对路径（相对于项目根目录）和绝对路径。
- `distributionCertificate.password` 是位于 `distributionCertificate.path` 的分发证书的密码。

#### 多 target 项目

如果 iOS 应用使用了 [App Extensions](https://developer.apple.com/app-extensions/)（例如 Share Extension、Widget Extension 等），就需要为 Xcode 项目的每个 target 提供凭据。这是必要的，因为每个扩展都由单独的 bundle identifier 标识。

假设项目包含一个主应用 target（名为 `multitarget`）和一个 Share Extension target（名为 `shareextension`）。

![Xcode 多 target 配置](/static/images/eas-build/multi-target.png)

在这种情况下，**credentials.json** 应如下所示：

```json credentials.json
{
  "ios": {
    "multitarget": {
      "provisioningProfilePath": "ios/certs/multitarget-profile.mobileprovision",
      "distributionCertificate": {
        "path": "ios/certs/dist.p12",
        "password": "DISTRIBUTION_CERTIFICATE_PASSWORD"
      }
    },
    "shareextension": {
      "provisioningProfilePath": "ios/certs/shareextension-profile.mobileprovision",
      // 可以使用与第一个 target 相同的分发证书，也可以使用新的证书
      "distributionCertificate": {
        "path": "ios/certs/another-dist.p12",
        "password": "ANOTHER_DISTRIBUTION_CERTIFICATE_PASSWORD"
      }
    }
  }
}
```

## 设置凭据来源

可以在构建 profile 上指定 `"credentialsSource": "local"` 或 `"credentialsSource": "remote"`，告诉 EAS Build 如何解析凭据。

- 如果提供 `"local"`，则使用 **credentials.json**。
- 如果提供 `"remote"`，则从 EAS 服务器解析凭据。

例如，部署到 Amazon Appstore 时使用本地凭据，部署到 Google Play Store 时使用远程凭据：

```json eas.json
{
  "build": {
    "amazon-production": {
      "credentialsSource": "local",
      "android": {
        // ...
      }
    },
    "google-production": {
      "credentialsSource": "remote",
      "android": {
        // ...
      }
    }
  }
}
```

如果不设置任何选项，`"credentialsSource"` 默认为 `"remote"`。

## 在从 CI 触发的构建上使用本地凭据

开始设置 CI 作业之前，请确认 **credentials.json** 和 **eas.json** 已按[上文所述](#credentialsjson)配置。

开发者通常用环境变量向 CI 作业提供密钥。这种方式的一个难点是 **credentials.json** 包含一个 JSON 对象，可能很难正确转义后再赋给环境变量。一种可行做法是把文件转换成 base64 编码的字符串，把环境变量设为该值，稍后在 CI 上解码并还原文件。

可以考虑以下步骤：

- 在控制台运行下面的命令，根据凭据文件生成 Base64 字符串：

  ```sh
  base64 credentials.json
  ```

- 在 CI 上，用上面命令的输出设置 `CREDENTIALS_JSON_BASE64` 环境变量。
- 在 CI 作业中，用一条简单的 shell 命令还原文件：

  ```sh
  echo $CREDENTIALS_JSON_BASE64 | base64 -d > credentials.json
  ```

同样，可以编码密钥库、描述文件和分发证书，以便稍后在 CI 上还原。要成功地从 CI 使用本地凭据触发构建，必须确保所有凭据都存在于 CI 实例的文件系统中（位置与 **credentials.json** 中定义的相同）。

还原步骤就绪后，可以使用[从 CI 触发构建](/build/building-on-ci)指南中描述的同一流程来触发构建。
