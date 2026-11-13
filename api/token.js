export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method not allowed' })
  }

  // 【重点】白名单：只允许你的扩展访问！
  const allowOrigin = "chrome-extension://hgkgjmdidmabaillnghakjgdfchgekfj"
  res.setHeader("Access-Control-Allow-Origin", allowOrigin)
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  // 处理预检 OPTIONS 请求（就是卡死你的那个请求！）
  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  try {
    const { app_id, app_secret } = req.body
    if (!app_id || !app_secret) {
      return res.status(400).json({ msg: '缺少 app_id / app_secret' })
    }

    // 转发请求到飞书官方接口
    const feishuRes = await fetch("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ app_id, app_secret })
    })
    const data = await feishuRes.json()
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ msg: '中转服务异常', error: err.message })
  }
}
