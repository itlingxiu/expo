---
title: 使用 EAS Update 进行端到端代码签名
description: 了解代码签名和密钥轮换在 EAS Update 中如何工作。
---

# 使用 EAS Update 进行端到端代码签名

:::note
EAS Update 代码签名仅对订阅了 EAS Production 或 Enterprise 方案的账户可用。参见 [EAS 定价方案](https://expo.dev/pricing)。
:::

`expo-updates` 库支持使用[公钥密码学](https://en.wikipedia.org/wiki/Public-key_cryptography)进行端到端代码签名。代码签名允许开发者用自己的密钥对更新进行密码学签名。签名随后在客户端应用更新之前进行验证，这确保 ISP、CDN、云提供商，甚至 EAS 本身都无法篡改应用所运行的更新。

以下步骤将引导你生成私钥和对应证书、配置项目以使用代码签名，并为应用发布已签名的更新。

## 生成私钥与对应证书

在此步骤中，我们将为你的应用生成密钥对和对应的代码签名证书。为 `--key-output-directory` 标志指定源代码管理之外的目录，以确保生成的私钥不会被意外加入源代码管理。

```sh
$ npx expo-updates codesigning:generate \
  --key-output-directory ../keys \
  --certificate-output-directory certs \
  --certificate-validity-duration-years 10 \
  --certificate-common-name "Your Organization Name"
```

此命令生成了密钥对以及要包含在应用中的代码签名证书：

- `../keys/private-key.pem`：密钥对的私钥。
- `../keys/public-key.pem`：密钥对的公钥。
- `certs/certificate.pem`：配置为有效期 10 年的代码签名证书。此文件应加入源代码管理（如果适用）。

- 生成的私钥必须保持私密和安全。上面的命令建议在源代码管理之外的目录中生成并存储这些密钥，以确保它们不会被意外提交到源代码管理。我们建议以与存储其他敏感信息相同的方式存储私钥（KMS、密码管理器等），你如何存储它会改变第 3 步发布更新所需的步骤。
- 公钥可以与私钥放在一起，但它不敏感。
- 证书应包含在项目中（提交到源代码管理）。它包含公钥以及验证代码签名的方法。下载已签名的更新时，会用此证书验证更新的签名。
- 证书有效期是一项可能根据应用安全需求而变化的设置。
  - 较短的有效期需要更频繁地[轮换密钥](#密钥轮换)，但被认为是更好的实践，因为被攻陷的私钥会更早过期，从而限制暴露。
  - 较短的有效期会增加应用发布流程的开销，因为必须更频繁地轮换密钥。证书过期的二进制文件不会应用新更新。
  - 例如，Expo 为公开的 Expo Go 应用把此值设为 20 年，但对二进制文件分发更频繁的内部应用只设为 1 年。我们计划每 10 年轮换一次密钥。

## 配置项目以使用代码签名

```sh
$ npx expo-updates codesigning:configure \
  --certificate-input-directory certs \
  --key-input-directory ../keys
```

**如果你使用持续原生生成（CNG）来生成原生项目**，那么 `npx expo-updates codesigning configure` 命令生成的 **app.json** 配置就是你所需要的全部。更改会在下次生成原生项目时应用。

<details>
<summary>在 app.json 中配置代码签名</summary>

运行上面的命令后，**app.json** 会包含代码签名的额外配置：

```json app.json
{
  "expo": {
    "updates": {
      "codeSigningCertificate": "./certs/certificate.pem",
      "codeSigningMetadata": {
        "keyid": "main",
        "alg": "rsa-v1_5-sha256"
      }
    }
  }
}
```

</details>

**如果你不使用持续原生生成（CNG）来生成原生项目**，则需要在应用的 **AndroidManifest.xml** 和/或 **Expo.plist** 文件中配置代码签名。

<details>
<summary>在 Android 原生项目中配置代码签名</summary>

你需要在 **android/app/src/main/AndroidManifest.xml** 的 `<application>` 元素中添加两个字段。

在此之前，我们需要生成证书的 XML 转义版本。你可以复制 **certs/certificate.pem** 的内容，手动把所有 `\r` 字符替换为 `&#xD;`、把 `\n` 替换为 `&#xA;`，或运行以下脚本代为完成：

```sh
$ node -e "console.log(require('fs').readFileSync('./certs/certificate.pem', 'utf8')\
.replace(/\r/g, '&#xD;').replace(/\n/g, '&#xA;'));"
```

现在添加以下两个字段，并把 `expo.modules.updates.CODE_SIGNING_CERTIFICATE` 字段的 `android:value` 替换为 XML 转义后的证书。你不需要修改 `expo.modules.updates.CODE_SIGNING_METADATA` 条目的值。

```xml android/app/src/main/AndroidManifest.xml
<meta-data
  android:name="expo.modules.updates.CODE_SIGNING_CERTIFICATE"
  android:value="(insert XML-escaped certificate here)"
  />
<meta-data
  android:name="expo.modules.updates.CODE_SIGNING_METADATA"
  android:value="{&quot;keyid&quot;:&quot;main&quot;,&quot;alg&quot;:&quot;rsa-v1_5-sha256&quot;}"
  />
```

</details>

<details>
<summary>在 iOS 原生项目中配置代码签名</summary>

你需要在 **ios/project-name/Supporting/Expo.plist** 的 `<dict>` 元素中添加两个字段。

在此之前，我们需要生成证书的 XML 转义版本。你可以复制 **certs/certificate.pem** 的内容，把所有 `\r` 字符替换为 `&#xD;`，或运行以下脚本代为完成：

```sh
$ node -e "console.log(require('fs').readFileSync('./certs/certificate.pem', 'utf8')\
.replace(/\r/g, '&#xD;'));"
```

现在添加以下两个字段，并把证书值替换为 XML 转义后的证书。你不需要更新 `EXUpdatesCodeSigningMetadata` 字段。

```xml ios/project-name/Supporting/Expo.plist
    <key>EXUpdatesCodeSigningCertificate</key>
    <string>-----BEGIN CERTIFICATE-----&#xD;
(insert XML-escaped certificate, it should look something like this)&#xD;
(spanning multiple lines with \r escaped but \n not escaped)&#xD;
+-----END CERTIFICATE-----&#xD;
</string>
    <key>EXUpdatesCodeSigningMetadata</key>
    <dict>
      <key>keyid</key>
      <string>main</string>
      <key>alg</key>
      <string>rsa-v1_5-sha256</string>
    </dict>
```

</details>

配置好代码签名后，用新的运行时版本创建新构建。代码签名证书会嵌入这个新构建。

## 为应用发布已签名的更新

```sh
$ eas update --private-key-path ../keys/private-key.pem
```

在使用 `eas update` 发布 EAS Update 期间，EAS CLI 会自动检测到你的应用配置了代码签名。然后它验证更新的完整性，并用你的私钥创建数字签名。此过程在本地执行，因此私钥永远不会离开你的机器。生成的签名会自动发送到 EAS，与更新一起存储。

## 验证更新已加载

在客户端下载更新（此步骤由库自动完成）。第 2 步中为代码签名配置的构建会检查是否有新更新可用。服务器用第 3 步发布的更新及其生成的签名进行响应。下载之后、应用之前，会对照嵌入的证书和所含签名验证更新。如果证书和签名有效，则应用更新，否则拒绝。

## 更多信息

### 密钥轮换

密钥轮换是更改用于签名更新的密钥对的过程。最常见于以下几种情况：

- 密钥过期。在上一节的第 1 步中，我们把 `certificate-validity-duration-years` 设为 10 年（不过它可以配置为任何值）。这意味着 10 年后，用与该证书对应的私钥签名的更新在被应用下载后将不再被应用。在其签名证书过期之前下载的更新会继续正常工作。在证书过期之前充分提前轮换密钥，有助于预先避免潜在的密钥过期问题，并有助于保证所有用户在旧证书过期之前都在使用新证书。
- 私钥泄露。如果用于签名更新的私钥被意外公开，它就不能再被视为安全的，因此用它签名的更新的完整性也不能再得到保证。例如，恶意行为者可以制作恶意更新并用泄露的私钥签名。
- 出于安全最佳实践的密钥轮换。定期轮换密钥是最佳实践，以确保系统能够经受为响应上述其他原因而进行的手动密钥轮换。

在任何这些情况下，步骤都类似：

1. 备份上面第 1 步生成的旧密钥和证书。
2. 从上面的第 1 步开始，按上述步骤生成新密钥。为便于调试，你可能希望通过修改应用配置（**app.json**）中的 `updates.codeSigningMetadata.keyid` 字段来更改新密钥的 `keyid`。
3. 代码签名证书是应用运行时的一部分，因此使用此证书的构建应设置新的运行时版本，以确保新构建中只运行用新密钥签名的更新。
4. 按上面的第 3 步，使用新密钥发布已签名的更新。

### 移除代码签名

从应用中移除代码签名的过程类似于[密钥轮换](#密钥轮换)，可以把它看成轮换到 `null` 密钥。

1. 备份上面第 1 步生成的旧密钥和证书。
2. 从应用配置（**app.json**）中移除 `updates.codeSigningMetadata` 字段。
3. 没有证书的新应用是一个新的不同运行时，因此应为构建设置新的运行时版本，以确保新构建中只运行未签名的更新。
