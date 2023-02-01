import { Configuration, OpenAIApi } from 'openai'

import type { NextApiRequest, NextApiResponse } from 'next'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { prompt } = req.body

    // Image generation
    const response = await openai.createImage({
      prompt, // テキストプロンプト
      n: 1, // 画像を生成する数
      size: '512x512', // 画像サイズ
      response_format: 'b64_json', // 応答形式
    })

    const image = response.data.data[0].b64_json

    res.status(200).json({ image })
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
}
