---
title: 身份验证
description: 了解在 Expo 与 React Native 应用中实现身份验证的常用方法、模式与方案。
---

# Expo 与 React Native 应用中的身份验证

身份验证（authentication）是 90% 到 95% 的现代应用都离不开的关键部分。本指南介绍常见的身份验证方法、模式与解决方案。

:::note 太长不看（TL;DR）
身份验证很难。想跳过复杂性的读者可以直接跳到[身份验证方案](#身份验证方案)一节。
:::

身份验证涉及的不只是客户端代码：服务器请求、密码流程、第三方提供商（Google、Apple）、邮件处理以及 OAuth 标准，都在其中。

## 导航中的身份验证流程

一个基本要求是：把公开页面（登录/注册）与受保护页面（主页/个人资料）分开。导航把这个问题简化为一次判断 —— "用户是否已通过身份验证？"。建议的起点是一个硬编码的布尔值，例如 `isAuthenticated = true`，之后再接入真正的身份验证。

**使用 Expo Router** —— Expo Router v5 引入了受保护路由（protected routes），未通过身份验证时阻止访问页面；它适用于客户端导航，并简化了设置。旧版本可以用重定向（redirects）实现，效果相同但需要更多手动配置；出于向后兼容，v5 仍支持这种方式。

相关视频：[Expo Router Protected Routes](https://www.youtube.com/watch?v=zHZjJDTTHJg)。

**使用 React Navigation** —— 它的身份验证流程指南介绍了如何组织导航逻辑，并提供基于身份验证状态的[静态](https://reactnavigation.org/docs/auth-flow/?config=static#how-it-will-work)与[动态](https://reactnavigation.org/docs/auth-flow/?config=dynamic#how-it-will-work)示例。参见 [authentication flow guide](https://reactnavigation.org/docs/auth-flow/)。

## 邮箱与密码

邮箱加密码是一种流行的选择。为了对用户友好，它需要支持忘记密码与重置密码，以便账户恢复。

内置邮箱/密码身份验证的更快替代方案：Clerk、Supabase、Cognito、Firebase 和 Better Auth。它们大多提供慷慨的免费额度，不过如果应用增长迅速，也应评估定价。它们的主要优势是集成简单 —— 有文档、起步模板和预构建组件。

**安全清单（OWASP）与商店审核的注意事项** —— 自己构建身份验证的开发者应该查阅 OWASP 的 [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-cheat-sheet)，其中涵盖密码长度、加密、恢复与安全存储等内容。

:::note
仅提供邮箱/密码通常就足以通过 App Store 与 Play Store 的审核，可以作为首次提交的方案。不过，如果提供了 "Sign in with Google"，而不同时支持 "Sign in with Apple"，Apple 可能会拒绝；反过来在 Google Play 上也一样。
:::

- [Better Auth 示例](https://github.com/expo/examples/tree/master/with-better-auth)（邮箱/密码演示）
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-cheat-sheet)

## 免密登录

免密登录（passwordless login）省去了创建和记忆密码的负担。用户只需提供邮箱或手机号，应用就会把[魔法链接](https://auth0.com/docs/authenticate/passwordless/authentication-methods/email-magic-link#classic-login-flow-with-magic-links)或一次性验证码（[OTP](https://en.wikipedia.org/wiki/One-time_password)）发送到他们的收件箱或设备 —— 注册流程更顺畅，阻力更小。

**魔法链接（Magic links）** —— 用户收到一封邮件，其中的链接会跳转回应用；如果一切顺利，会话就被验证并建立。深链接（deep linking）必不可少：用户离开了应用，链接必须能重新打开应用并路由到正确的页面；如果深链接失败，会话无法验证，登录就会中断。使用 Expo Router 时，大多数情况下深链接是自动处理的，只需极少配置。React Navigation 也支持深链接，但需要手动设置。

相关链接：[链接到你的应用](/linking/into-your-app)、[React Navigation 深链接指南](https://reactnavigation.org/docs/deep-linking/)。

**一次性验证码（OTP）** —— 用户不用点击链接，而是复制验证码并手动返回应用，在有效期内输入。不涉及深链接。较新的 Android 与 iOS 版本能识别收到的消息中的验证码，并在键盘上方提供自动填充，一键完成输入。

:::note
魔法链接和验证码都能通过 Google Play 与 Apple App Store 的审核；即使还没有添加社交/OAuth 登录，只提供其中一种也可以获批。
:::

## OAuth 2.0

OAuth 2.0 让你可以使用 Google、Apple、GitHub 等服务的现有账户登录。它是一种广泛使用的安全协议，让应用无需处理密码即可访问用户在其他服务上的信息 —— 一键登录、节省时间、建立信任、无需管理密码。

:::note
OAuth 流程可能很复杂；大多数提供商都提供能处理一切的 SDK 与服务，见[身份验证方案](#身份验证方案)一节。
:::

如果想要完全掌控或理解其内部原理，下面几节展示如何用 Expo 构建完整的 OAuth 流程。参见 [OAuth 2.0](https://oauth.net/2)。

### OAuth 的工作原理

授权服务器（authorization server）充当安全的中间人。用户在那里登录并批准访问特定数据（姓名、邮箱），而不是把密码交给应用。服务器签发一个临时授权码（code），应用再拿它去换取访问令牌（access token）。

:::note
"客户端（client）"只是指应用本身，无论是服务器、桌面、移动还是其他平台。这一模式适用于任何提供商 —— Google、Apple、GitHub 都遵循同样的大致步骤。
:::

### 使用 Expo API Routes 自定义 OAuth

客户端获取授权的最佳方式是经由授权服务器中介 —— 这正是 Expo API Routes 可以构建的东西。

Expo 支持在应用内实现完整的 OAuth 流程，使用：[Expo Router](/router/introduction)、[Expo Router API Routes](/router/web/api-routes) 与 [Expo AuthSession](/versions/latest/sdk/auth-session)。

一些提供商为应用内登录提供原生 API。Google 在 Android 上有原生的 Sign in with Google 体验（见 [Google 身份验证指南](/guides/google-authentication)）。Apple 的 Sign in with Apple 在 iOS 上使用原生底部弹窗与 Face ID（见 [`expo-apple-authentication`](/versions/latest/sdk/apple-authentication) 参考）。这套设置让你完全掌控 Android、iOS 与 Web 上的登录。

**什么是 Expo API Routes？** 直接在 Expo 应用内编写的服务端逻辑 —— 就像 Express 或 Next.js 后端的请求处理器，无需外部服务器。这让授权码交换等敏感环节可以安全地处理；因为路由运行在服务器上，密钥、JWT 签发与令牌验证都是安全的。

:::note
本质上，你是在为自己的应用构建一个轻量级的自定义身份验证服务器，全部在 Expo 项目内完成。
:::

**什么是 Expo AuthSession？** 一个客户端包，打开浏览器或原生弹窗启动 OAuth 流程，处理重定向、解析授权响应，并把用户带回应用。它发起流程，并在授权完成后与 API Route 通信。参见[使用 OAuth 或 OpenID 提供商进行身份验证](/guides/authentication)与[授权码交换](https://www.oauth.com/oauth2-servers/pkce/authorization-code-exchange)。

这套设置可以实现：用 AuthSession 启动登录；在 API Route 中接收授权码；安全地用授权码换取令牌；用你自己的逻辑生成自定义 JWT；把令牌返回给客户端；用 cookie（Web）或 JWT（原生）存储会话；用 EAS Hosting 即时部署（起步免费）。

教程覆盖 Android、iOS 与 Web 上的 OAuth，包括创建/验证自定义 JWT、管理会话以及保护 API 路由；初学者建议从 Google 教程开始：

- [Google Sign-In with Expo OAuth](https://www.youtube.com/watch?v=V2YdhR1hVNw)
- [Sign in with Apple using Expo](https://www.youtube.com/watch?v=tqxTijhYhp8)

**OAuth 之后管理会话** —— 身份验证之后，必须存储、恢复并验证会话：客户端安全存储、应用重启后的恢复，以及保护 API 路由让只有已登录用户可以通过。传统上 Web 使用 [cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies#what_cookies_are_used_for)，原生应用使用 [JSON Web Tokens（JWT）](https://en.wikipedia.org/wiki/JSON_Web_Token)。

教程展示了在收到 Google 或 Apple 的 ID 令牌后，通过 Expo API Routes 在服务端生成自定义 JWT，从而掌控：跨提供商一致的载荷字段、自定义过期时间，以及用密钥签名以便后续服务端验证。

创建之后：Android/iOS 可以用 [`expo-secure-store`](/versions/latest/sdk/securestore) 安全存储令牌；Web 应用可以把它设置为安全的 cookie。每次请求时令牌都会返回服务器，服务器先验证签名与过期时间再处理。这让后端保持无状态（stateless）、可扩展且跨平台安全。

## 身份验证方案

对 Expo 有一等支持的内置服务：

- **Better Auth** —— 为开发者打造的现代开源提供商，与 Expo 集成顺畅；其指南介绍了如何结合 Expo API Routes 使用以获得完全掌控。适用于任何提供商，可用 EAS Hosting 轻松部署。（[BetterAuth Expo 文档](https://www.better-auth.com/docs/integrations/expo)）
- **Clerk** —— 功能强大的全功能服务，对 Expo 支持极佳：邮箱/密码、验证码、魔法链接、OAuth 提供商、通行密钥（passkeys），还有一个处理大量集成工作的原生 Expo 模块。（[Clerk](https://clerk.com/expo-authentication)）
- **Supabase** —— 完整后端平台，内置可与任何 OAuth 提供商配合的身份验证；与 Expo 集成良好，支持邮箱、魔法链接等。（[Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)）
- **Cognito** —— AWS Cognito 管理用户池与身份，可与其他 AWS 服务无缝连接，通过 AWS Amplify 集成；需要更多配置，但扩展性好。（[文章](https://medium.com/@juliuscecilia33/aws-cognito-and-react-native-bf23ef7fea23)）
- **Firebase Auth** —— Google 的平台，支持邮箱、魔法链接与 OAuth 提供商；通过 `react-native-firebase` 在 React Native 中工作，兼容 Expo 开发构建。（[rnfirebase auth usage](https://rnfirebase.io/auth/usage)、[react-native-firebase](https://github.com/invertase/react-native-firebase)）

## 现代方式

身份验证跑通之后，可选的增强项：生物识别与通行密钥能带来便利、信任与速度。

**生物识别（Biometrics）** —— Face ID / Touch ID 可以在有效会话后解锁应用或确认身份。单独的生物识别提示并不与服务器进行身份验证；它是本地的一道门，保护设备上的内容或凭据。可通过 [`expo-local-authentication`](/versions/latest/sdk/local-authentication) 或 [react-native-biometrics](https://github.com/SelfLender/react-native-biometrics) 实现。提供商可以把系统提示与设备绑定的凭据配对，在服务端进行身份验证并创建会话 —— 例如 [Clerk 生物识别登录](https://clerk.com/docs/expo/guides/development/custom-flows/authentication/biometric-sign-in)会把一次应用安装注册为受信任设备；批准后，设备对一次性挑战进行签名，私钥始终留在设备上。与通行密钥不同，该凭据只作用于该应用安装，不使用 [WebAuthn](https://www.w3.org/TR/webauthn-2/)。

**通行密钥（Passkeys）** —— 一种由 Apple、Google 与 Microsoft 支持的免密登录方式，使用平台级密码学与生物识别。流畅且安全，但用户必须先登录过才能注册通行密钥，而且没有提供商托管时需要额外配置。

相关链接：[Passkeys 概览](https://safety.google/authentication/passkey)、[react-native-passkeys](https://github.com/peterferguson/react-native-passkeys)、[Clerk Passkeys for Expo](https://clerk.com/docs/references/expo/passkeys)。

## 建议

本指南从基础邮箱/密码一直到完整的自定义 OAuth、会话管理、生物识别与通行密钥 —— 不必一次全部用上。从简单开始通常是最好的：用魔法链接或一次性验证码之类的邮箱认证上线，往往就足以通过 App Store 审核并开始收集真实用户的反馈。对于预期首日流量大、或需要低阻力跨平台登录的应用，尽早投资更完整的流程，会在引导、信任与留存上获得回报。OAuth、生物识别与通行密钥不是必需的，但在核心就位后是很好的补充。关键在于：构建适应当前需求的身份验证，同时保持足够的灵活性，让它随产品一起成长。
