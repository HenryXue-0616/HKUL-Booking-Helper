# HKUL Booking Helper

A browser userscript for the HKU Libraries booking website, with English, 简体中文 and 繁體中文 interfaces.

**Unofficial community tool. Not affiliated with or endorsed by HKU Libraries.**

## Features

- Choose location, floor, facility type, facility, date and sessions in one panel.
- Options are synchronized with the original New Booking form.
- Sessions appear in chronological order.
- Submit immediately or schedule a one-time task using Hong Kong time (UTC+8).
- Preset an unreleased date for scheduled booking.
- Dry run without submitting, cancel a task, and inspect website result messages.
- Confirmation-detail checks and duplicate-submission protection.

## Installation

1. Install a userscript manager such as Tampermonkey in your browser.
2. Open [`hkul-booking-helper.user.js`](./hkul-booking-helper.user.js) in this repository and click **Raw**. If your manager offers installation, review and install it.
3. Alternatively, create a new script in your manager, replace the default code with this file's entire contents, and save.
4. Ensure both the manager and the script are enabled.
5. Open [HKUL New Booking](https://booking.lib.hku.hk/Secure/NewBooking.aspx), sign in yourself, and refresh the page. The helper panel appears on the right.

For upgrades, replace the existing script instead of enabling multiple copies. Automatic update URLs are not configured in this release.

## Usage

1. Select **Language** at the top of the panel. English is the default; your choice is saved.
2. Select Location → Floor → Facility Type → Facility, allowing the website to finish each update.
3. Select a date and sessions. Changing facility or date clears previous session choices.
4. First try **Dry run (no submission)** with a currently available date and session. This reloads and fills the real form without clicking Submit or Yes.
5. For a real booking, read the website's applicable policies and enable **Submit automatically and confirm Yes**.
6. Choose **Submit now**, or set **Run at (Hong Kong, UTC+8)** and choose **Schedule booking**.
7. Check **My Booking Record** to verify the outcome. “Confirmation sent” is not proof of success.

For an unreleased date, enable **Preset an unreleased date**. The displayed sessions come from the current facility and do not guarantee future availability. Booking date and execution date are separate settings.

## Timing and limitations

- Keep the tab open, the computer awake, the network connected and the login session valid.
- At the scheduled time, the helper reloads the booking form once.
- If the requested date is absent, it waits at least 5 seconds before reloading, up to 3 retries. Loading and restoring form options add to this interval.
- Unavailable sessions stop the task. There is no continuous polling for cancellations or automatic alternative-seat selection.
- Submission is not retried after it starts. Network failures can leave the outcome uncertain; check the booking record manually.
- A task more than 60 seconds late stops. Overall execution times out after 120 seconds.
- Browser throttling, sleep, expired login, CAPTCHA, extra manual steps or website changes can prevent completion. Exact midnight execution and booking success are not guaranteed.
- Cancel stops future helper actions; it cannot withdraw a request already sent or cancel an existing booking.
- Use one task tab. Do not duplicate tabs or run the same booking in multiple browser profiles.
- Facility names and website responses remain in the website's original language. Native date-picker formatting follows the browser/OS locale.

## Privacy

No external backend, analytics or credential collection is included. The script uses the website's own form controls; it does not read passwords, cookies or authentication tokens.

Task settings and status are stored in the booking site's `localStorage`; tab identity and UI draft settings use `sessionStorage`. These are browser storage, not encrypted secret storage. Do not publish account details, session data or screenshots containing personal information.

## Validation status

Version **2.1.0**. The implementation was based on observed HKUL form controls. JavaScript syntax and simulated tests passed for option synchronization, chronological ordering, language switching, selection preservation, dry runs, bounded date retries, confirmation mismatch and duplicate-submission protection.

**Real booking completion and an end-to-end midnight run have not been verified. Not every facility type has been tested.** Treat this as an experimental helper, follow library booking policies and applicable limits, and verify reservations yourself.

## 中文说明

这是非官方港大图书馆预约辅助脚本，不代表港大或图书馆。

- 在脚本管理器中新建脚本，粘贴 `.user.js` 全部内容并保存；更新时替换旧版。
- 打开 New Booking 页面并登录，确保管理器总开关及脚本开关都已启用。
- 面板顶部可选择 English、简体中文、繁體中文；时段按时间顺序排列。
- 在面板选好地点、楼层、类型、设施、日期和时段，先使用“不提交演练”。
- 正式预约需勾选自动提交，然后选择立即提交或设置香港时间的定时任务。
- 运行时必须保持网页打开、电脑唤醒和登录有效。尚未进行真实预约及跨午夜完整验证，不能保证抢位成功。
- 取消任务不能撤回已发送的请求。最终结果以 My Booking Record 为准。

## License

[MIT](./LICENSE).
