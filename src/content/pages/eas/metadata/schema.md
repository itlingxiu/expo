---
title: EAS Metadata 的 Schema
description: EAS Metadata 中商店配置的参考。
---

# EAS Metadata 的 Schema

:::warning
**EAS Metadata** 处于 [beta](/more/release-statuses#beta)，可能会有破坏性变更。
:::

EAS Metadata 中的商店配置包含那些否则需要通过应用商店仪表盘手动提供的信息。本文档概述商店配置中对象的结构。

> 如果你使用 [VS Code Expo Tools 扩展](https://github.com/expo/vscode-expo#readme)，就可以在编辑器中通过自动补全、建议和警告获得全部这些信息。

## 配置 schema

商店配置对象中的一个关键属性是 `configVersion`。应用商店可能会要求更多信息，或更改现有信息结构才能发布你的应用。此属性用于对不向后兼容的变更进行版本管理。

EAS Metadata **目前**只支持 Apple App Store。

| 名称 | 类型 | 规则 | 说明 |
| --- | --- | --- | --- |
| `configVersion` | `number` | `enum: 0` | EAS Metadata 商店配置 schema 的版本。 |
| `apple` | `object` | | App Store 的全部可配置属性。 |
| `version` | `string` | | 同步商店配置中定义的全部元数据时使用的应用版本。默认情况下，EAS Metadata 会选择应用商店中最新的可用版本。 |
| `copyright` | `string` | | 拥有该应用专有权利的个人或实体名称，前面加上获得权利的年份。（例如 "2008 Acme Inc."） |
| `advisory` | [AppleAdvisory](#apple-内容分级) | | 用于确定应用年龄分级的 App Store 问卷。 |
| `categories` | [AppleCategories](#apple-类别) | | 应用的 App Store 类别。你可以添加主要类别、次要类别，以及可能的子类别。 |
| `info` | `Map<`[AppleLanguage](#apple-信息)`, `[AppleInfo](#apple-信息)`>` | | 应用在 App Store 上的本地化展示信息。 |
| `release` | [AppleRelease](#apple-发布) | | 所选版本的应用发布策略。 |
| `review` | [AppleReview](#apple-审核) | | 供 App Store 审核团队审核应用所需的全部信息，包括联系信息和凭据（如适用）。 |

### Apple 内容分级

Apple 使用一份复杂问卷来确定应用的[年龄分级](https://help.apple.com/app-store-connect/#/dev599d50efb)。App Store 上的家长控制使用这个计算出的年龄分级。默认情况下，EAS Metadata 对每个问题使用限制最少的答案。

<details>
<summary>使用限制最少答案的完整分级问卷</summary>

```json store.config.json
{
  "configVersion": 0,
  "apple": {
    "advisory": {
      "alcoholTobaccoOrDrugUseOrReferences": "NONE",
      "contests": "NONE",
      "gamblingSimulated": "NONE",
      "horrorOrFearThemes": "NONE",
      "matureOrSuggestiveThemes": "NONE",
      "medicalOrTreatmentInformation": "NONE",
      "profanityOrCrudeHumor": "NONE",
      "sexualContentGraphicAndNudity": "NONE",
      "sexualContentOrNudity": "NONE",
      "violenceCartoonOrFantasy": "NONE",
      "violenceRealistic": "NONE",
      "violenceRealisticProlongedGraphicOrSadistic": "NONE",
      "gambling": false,
      "unrestrictedWebAccess": false,
      "kidsAgeBand": null,
      "ageRatingOverride": "NONE",
      "koreaAgeRatingOverride": "NONE"
    }
  }
}
```

</details>

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `alcoholTobaccoOrDrugUseOrReferences` | [AppleAgeRating](#apple-内容分级年龄等级) | 应用是否包含酒精、烟草或药物的使用或相关内容？ |
| `contests` | [AppleAgeRating](#apple-内容分级年龄等级) | 应用是否包含竞赛？ |
| `gambling` | `boolean` | 你的应用是否包含赌博？ |
| `gamblingSimulated` | [AppleAgeRating](#apple-内容分级年龄等级) | 应用是否包含模拟赌博？ |
| `horrorOrFearThemes` | [AppleAgeRating](#apple-内容分级年龄等级) | 应用是否包含恐怖或恐惧主题？ |
| `kidsAgeBand` | [AppleKidsAge](#apple-内容分级儿童年龄) | 当家长访问 App Store 上的儿童类别时，他们期望找到的应用会保护孩子的数据、只提供适龄内容，并要求家长门控才能链出应用、请求权限或展示购买机会。不得向第三方传输任何个人身份信息或设备信息，并且广告必须经过人工审核以确认适龄后才能展示，这一点至关重要。[了解更多](https://developer.apple.com/news/?id=091202019a) |
| `matureOrSuggestiveThemes` | [AppleAgeRating](#apple-内容分级年龄等级) | 应用是否包含成人或暗示性主题？ |
| `medicalOrTreatmentInformation` | [AppleAgeRating](#apple-内容分级年龄等级) | 应用是否包含医疗或治疗信息？ |
| `profanityOrCrudeHumor` | [AppleAgeRating](#apple-内容分级年龄等级) | 应用是否包含亵渎或粗俗幽默？ |
| `ageRatingOverride` | [AppleAgeRatingOverride](#apple-内容分级年龄等级覆盖) | 如果你的应用分级为 12+ 或更低，并且你认为其内容可能不适合儿童，可以手动覆盖年龄分级。[了解更多](https://developer.apple.com/help/app-store-connect/manage-app-information/set-an-app-age-rating) |
| `koreaAgeRatingOverride` | [AppleKoreaAgeRatingOverride](#apple-内容分级韩国年龄等级覆盖) | 如果你的应用分级为 12+ 或更低，并且你认为其内容可能不适合儿童，可以手动覆盖年龄分级。与 `ageRatingOverride` 相同，但适用于韩国。[了解更多](https://developer.apple.com/help/app-store-connect/manage-app-information/set-an-app-age-rating) |
| `sexualContentGraphicAndNudity` | [AppleAgeRating](#apple-内容分级年龄等级) | 应用是否包含露骨的性内容和裸体？ |
| `sexualContentOrNudity` | [AppleAgeRating](#apple-内容分级年龄等级) | 应用是否包含性内容或裸体？ |
| `unrestrictedWebAccess` | `boolean` | 你的应用是否包含不受限制的 Web 访问，例如内嵌浏览器？ |
| `violenceCartoonOrFantasy` | [AppleAgeRating](#apple-内容分级年龄等级) | 应用是否包含卡通或幻想暴力？ |
| `violenceRealistic` | [AppleAgeRating](#apple-内容分级年龄等级) | 应用是否包含写实暴力？ |
| `violenceRealisticProlongedGraphicOrSadistic` | [AppleAgeRating](#apple-内容分级年龄等级) | 应用是否包含长时间的露骨或虐待性写实暴力？ |

#### Apple 内容分级年龄等级

| 名称 | 说明 |
| --- | --- |
| `NONE` | 用于完全不涉及该主题的应用。 |
| `INFREQUENT_OR_MILD` | 用于提及该主题，或将该主题作为非主要功能的应用。 |
| `FREQUENT_OR_INTENSE` | 用于将该主题作为主要功能的应用。 |

#### Apple 内容分级儿童年龄

| 名称 | 说明 |
| --- | --- |
| `FIVE_AND_UNDER` | 适用于 5 岁及以下的儿童。 |
| `SIX_TO_EIGHT` | 适用于 6 到 8 岁的儿童。 |
| `NINE_TO_ELEVEN` | 适用于 9 到 11 岁的儿童。 |

#### Apple 内容分级年龄等级覆盖

| 名称 | 说明 |
| --- | --- |
| `NONE` | 不覆盖年龄分级 |
| `SEVENTEEN_PLUS` | 应用包含可能不适合 17 岁以下儿童的内容。 |
| `UNRATED` | 仅限成人。此内容不能在 App Store 上发布。它可以在 iOS 的替代应用市场或欧盟的网站上发布。 |

#### Apple 内容分级韩国年龄等级覆盖

| 名称 | 说明 |
| --- | --- |
| `NONE` | 不覆盖年龄分级 |
| `FIFTEEN_PLUS` | 应用包含可能不适合 15 岁以下儿童的内容。 |
| `NINETEEN_PLUS` | 应用包含可能不适合 19 岁以下儿童的内容。 |

### Apple 类别

App Store 通过[把应用归入类别](https://developer.apple.com/app-store/categories/)帮助用户发现新应用，使用主要类别、次要类别以及可能的子类别。

<details>
<summary>主要类别和次要类别</summary>

```json store.config.json
{
  "configVersion": 0,
  "apple": {
    "categories": ["FINANCE", "NEWS"]
  }
}
```

</details>

<details>
<summary>主要类别、子类别和次要类别</summary>

```json store.config.json
{
  "configVersion": 0,
  "apple": {
    "categories": [["GAMES", "GAMES_CARD", "GAMES_BOARD"], "ENTERTAINMENT"]
  }
}
```

</details>

| 名称 | 说明 |
| --- | --- |
| `BOOKS` | 内容传统上以印刷形式提供，并增加了交互性的应用。 |
| `BUSINESS` | 协助经营业务，或提供协作、编辑或分享与业务相关内容的方式的应用。 |
| `DEVELOPER_TOOLS` | 协助用户开发、维护或分享软件的应用。 |
| `EDUCATION` | 针对特定技能或学科提供交互式学习体验的应用。 |
| `ENTERTAINMENT` | 旨在用音频、视觉或其他内容娱乐用户的交互式应用。 |
| `FINANCE` | 提供金融服务或信息，以协助用户处理商业或个人财务的应用。 |
| `FOOD_AND_DRINK` | 提供与制备、食用或评测食物或饮料相关的推荐、指导或评论的应用。 |
| `GAMES` | 为娱乐目的提供单人或多人交互体验的应用。此类别最多可以有 2 个子类别：`GAMES_ACTION`、`GAMES_ADVENTURE`、`GAMES_BOARD`、`GAMES_CARD`、`GAMES_CASINO`、`GAMES_CASUAL`、`GAMES_FAMILY`、`GAMES_MUSIC`、`GAMES_PUZZLE`、`GAMES_RACING`、`GAMES_ROLE_PLAYING`、`GAMES_SIMULATION`、`GAMES_SPORTS`、`GAMES_STRATEGY`、`GAMES_TRIVIA`、`GAMES_WORD`。 |
| `GRAPHICS_AND_DESIGN` | 提供用于创建、编辑或分享视觉内容的工具或技巧的应用。 |
| `HEALTH_AND_FITNESS` | 与健康生活相关的应用，包括压力管理、健身和休闲活动。 |
| `LIFESTYLE` | 与大众兴趣主题或服务相关的应用。 |
| `MAGAZINES_AND_NEWSPAPERS` | 具有传统上以印刷形式提供的新闻内容，并增加了交互性的应用。 |
| `MEDICAL` | 专注于面向患者或医疗专业人员的医学教育、信息或健康参考的应用。 |
| `MUSIC` | 用于发现、收听、录制、演奏或作曲的应用。 |
| `NAVIGATION` | 提供信息以帮助用户到达物理位置的应用。 |
| `NEWS` | 提供时事和/或政治、娱乐、商业、科学、技术及其他感兴趣领域动态信息的应用。 |
| `PHOTO_AND_VIDEO` | 协助拍摄、编辑、管理、存储或分享照片和视频的应用。 |
| `PRODUCTIVITY` | 使特定流程或任务更有条理或更高效的应用。 |
| `REFERENCE` | 协助用户访问或检索一般信息的应用。 |
| `SHOPPING` | 提供购买商品或服务方式的应用。 |
| `SOCIAL_NETWORKING` | 通过文字、语音、照片或视频把人们连接起来的应用。 |
| `SPORTS` | 与职业、业余、大学或休闲体育活动相关的应用。 |
| `STICKERS` | 为消息应用提供扩展视觉功能的应用。此类别最多可以有 2 个子类别：`STICKERS_ANIMALS`、`STICKERS_ART`、`STICKERS_CELEBRATIONS`、`STICKERS_CELEBRITIES`、`STICKERS_CHARACTERS`、`STICKERS_EATING_AND_DRINKING`、`STICKERS_EMOJI_AND_EXPRESSIONS`、`STICKERS_FASHION`、`STICKERS_GAMING`、`STICKERS_KIDS_AND_FAMILY`、`STICKERS_MOVIES_AND_TV`、`STICKERS_MUSIC`、`STICKERS_PEOPLE`、`STICKERS_PLACES_AND_OBJECTS`、`STICKERS_SPORTS_AND_ACTIVITIES`。 |
| `TRAVEL` | 协助用户处理旅行任何方面（例如规划、购买或跟踪）的应用。 |
| `UTILITIES` | 让用户能够解决问题或完成特定任务的应用。 |
| `WEATHER` | 提供特定天气相关信息的应用。 |

### Apple 信息

App Store 是一项全球服务，被使用不同语言的许多人使用。你可以把 App Store 展示信息本地化为[多种语言](#apple-信息语言)。

<details>
<summary>英语（美国）的最少本地化信息</summary>

```json store.config.json
{
  "configVersion": 0,
  "apple": {
    "info": {
      "en-US": {
        "title": "Awesome app",
        "privacyPolicyUrl": "https://example.com/en/privacy"
      }
    }
  }
}
```

</details>

<details>
<summary>用英语（美国）编写的完整本地化信息</summary>

```json store.config.json
{
  "configVersion": 0,
  "apple": {
    "info": {
      "en-US": {
        "title": "App title",
        "subtitle": "Subtitle for your app",
        "description": "A longer description of what your app does",
        "keywords": ["keyword", "other-keyword"],
        "releaseNotes": "Bug fixes and improved stability",
        "promoText": "Short tagline for your app",
        "marketingUrl": "https://example.com/en",
        "supportUrl": "https://example.com/en/help",
        "privacyPolicyUrl": "https://example.com/en/privacy",
        "privacyChoicesUrl": "https://example.com/en/privacy/choices"
      }
    }
  }
}
```

</details>

| 名称 | 类型 | 规则 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `length: 2..30` | 商店中的应用名称。此名称应与已安装应用的名称相似。**警告：** 该名称在上架 App Store 之前会经过审核。 |
| `subtitle` | `string` | `length: 30` | 商店中应用的副文案。例如 "A Fun Game For Friends"。**警告：** 副标题在上架 App Store 之前会经过审核。 |
| `description` | `string` | `length: 10..4000` | 应用功能的主要描述 |
| `keywords` | `string[]` | `unique items`、`max length item: 100` | 帮助用户在 App Store 中找到应用的关键词列表 |
| `releaseNotes` | `string` | `max length: 4000` | 自上一个公开版本以来的变更 |
| `promoText` | `string` | `max length: 170` | 应用的简短标语 |
| `marketingUrl` | `string` | `max length: 255` | 应用营销页面的 URL |
| `supportUrl` | `string` | `max length: 255` | 应用支持页面的 URL |
| `privacyPolicyText` | `string` | | Apple TV 的隐私政策 |
| `privacyPolicyUrl` | `string` | `max length: 255` | 链接到你的隐私政策的 URL。**警告：** 所有应用都需要隐私政策。 |
| `privacyChoicesUrl` | `string` | `max length: 255` | 用户可以修改和删除从应用收集的数据，或决定其数据如何被使用和分享的 URL。 |

#### Apple 信息语言

| 语言 | 语言代码 |
| --- | --- |
| 阿拉伯语 | `ar-SA` |
| 加泰罗尼亚语 | `ca` |
| 中文 | `zh-Hans`（简体）、`zh-Hant`（繁体） |
| 克罗地亚语 | `hr` |
| 捷克语 | `cs` |
| 丹麦语 | `da` |
| 荷兰语 | `nl-NL` |
| 英语 | `en-AU`（澳大利亚）、`en-CA`（加拿大）、`en-GB`（英国）、`en-US`（美国） |
| 芬兰语 | `fi` |
| 法语 | `fr-CA`（加拿大）、`fr-FR`（法国） |
| 德语 | `de-DE` |
| 希腊语 | `el` |
| 希伯来语 | `he` |
| 印地语 | `hi` |
| 匈牙利语 | `hu` |
| 印度尼西亚语 | `id` |
| 意大利语 | `it` |
| 日语 | `ja` |
| 韩语 | `ko` |
| 马来语 | `ms` |
| 挪威语 | `no` |
| 波兰语 | `pl` |
| 葡萄牙语 | `pt-BR`（巴西）、`pt-PT`（葡萄牙） |
| 罗马尼亚语 | `ro` |
| 俄语 | `ru` |
| 斯洛伐克语 | `sk` |
| 西班牙语 | `es-MX`（墨西哥）、`es-ES`（西班牙） |
| 瑞典语 | `sv` |
| 泰语 | `th` |
| 土耳其语 | `tr` |
| 乌克兰语 | `uk` |
| 越南语 | `vi` |

### Apple 发布

把应用交到用户手中有多种策略。你可以在商店批准后自动发布应用，或逐步向用户发布更新。

<details>
<summary>在 2022 年 12 月 25 日（UTC）之后自动发布</summary>

```json store.config.json
{
  "configVersion": 0,
  "apple": {
    "release": {
      "automaticRelease": "2022-12-25T00:00:00+00:00"
    }
  }
}
```

</details>

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `automaticRelease` | `boolean\|Date` | 应用在获得 App Store 批准后是否以及如何自动发布。`false`：商店批准后手动发布应用（默认行为）。`true`：商店批准后自动发布。`Date`：商店批准后在此日期自动安排发布（使用 [RFC 3339](https://www.rfc-editor.org/rfc/rfc3339) 格式）。Apple 不保证你的应用会在所选的计划发布日期可用。 |
| `phasedRelease` | `boolean` | 自动更新的分阶段发布让你可以在 7 天内，逐步把此次更新发布给已开启自动更新的用户。请记住，此版本仍然可以作为来自 App Store 的手动更新提供给所有用户。你可以把分阶段发布暂停最多 30 天，或随时把此次更新发布给所有用户。[了解更多](https://help.apple.com/app-store-connect/#/dev3d65fcee1) |

### Apple 审核

在 App Store 上发布应用之前，需要商店批准。App Store 审核团队必须拥有测试你的应用所需的全部信息，否则你可能面临应用被拒。

<details>
<summary>最少的审核信息</summary>

```json store.config.json
{
  "configVersion": 0,
  "apple": {
    "review": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1 123 456 7890"
    }
  }
}
```

</details>

<details>
<summary>完整的审核信息</summary>

```json store.config.json
{
  "configVersion": 0,
  "apple": {
    "review": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1 123 456 7890",
      "demoUsername": "john",
      "demoPassword": "applereview",
      "demoRequired": false,
      "notes": "This is an example app primarily used for educational purposes."
    }
  }
}
```

</details>

| 名称 | 类型 | 规则 | 说明 |
| --- | --- | --- | --- |
| `firstName` | `string` | `min length: 1` | 应用联系人的名，以便在需要与 App Store 审核团队沟通时使用。 |
| `lastName` | `string` | `min length: 1` | 应用联系人的姓，以便在需要与 App Store 审核团队沟通时使用。 |
| `email` | `string` | `email` | 电子邮件联系地址，以便在需要与 App Store 审核团队沟通时使用。 |
| `phone` | `string` | | 联系电话号码，以便在需要与 App Store 审核团队沟通时使用。在电话号码前加上 “+” 以及国家代码。（例如 +44 844 209 0611） |
| `demoUsername` | `string` | | 用于登录你的应用以审核其功能的用户名。 |
| `demoPassword` | `string` | | 用于登录你的应用以审核其功能的密码。 |
| `demoRequired` | `boolean` | | 布尔值，表示审核应用功能是否需要登录信息。如果用户使用社交媒体登录，请提供一个供审核使用的账户信息。**警告：** 凭据在审核期间必须有效且处于活动状态。 |
| `notes` | `string` | `length: 2..4000` | 关于你的应用的附加信息，可在审核过程中提供帮助。**警告：** 不要在备注中包含演示账户详情。请改用 `demoUsername` 和 `demoPassword` 属性。 |
