'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '../supabase-provider'
import { v4 as uuidv4 } from 'uuid'
import { decode } from 'base64-arraybuffer'

import Image from 'next/image'
import Loading from '../../loading'

// 新規投稿
const PostNew = () => {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [image, setImage] = useState<string | null>(null)
  const [loadingGenerate, setLoadingGenerate] = useState(false)
  const [loadingPost, setLoadingPost] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    prompt: '',
  })

  const { name, prompt } = formData

  // 入力
  const onChange = (e: { target: { name: string; value: string } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // 画像生成
  const generateImage = async () => {
    setLoadingGenerate(true)

    try {
      const body = JSON.stringify({ prompt })

      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      })

      const data = await response.json()

      setImage(data.image)
    } catch (error) {
      alert(error)
    }

    setLoadingGenerate(false)
  }

  // 送信
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoadingPost(true)

    if (name && prompt && image) {
      // supabaseストレージに画像アップロード
      const { data: storageData, error: storageError } = await supabase.storage
        .from('posts')
        .upload(`${name}/${uuidv4()}`, decode(image), {
          contentType: 'image/png',
        })

      if (storageError) {
        alert(storageError.message)
        setLoadingGenerate(false)
        return
      }

      // 画像のURLを取得
      const { data: urlData } = await supabase.storage.from('posts').getPublicUrl(storageData.path)

      const image_url = urlData.publicUrl

      // Postテーブル追加
      const { error: insertError } = await supabase.from('posts').insert({
        name,
        prompt,
        image_url,
      })

      if (insertError) {
        alert(insertError.message)
        setLoadingPost(false)
        return
      }

      // トップページ遷移
      router.push('/')
      router.refresh()
    }

    setLoadingPost(false)
  }

  return (
    <div className="max-w-screen-md mx-auto">
      <form onSubmit={onSubmit}>
        <div className="mb-5">
          <div className="text-sm mb-1 text-white">名前</div>
          <input
            className="w-full bg-gray-200 rounded border py-1 px-3 outline-none focus:bg-white focus:ring-2 focus:ring-yellow-500"
            type="text"
            name="name"
            placeholder="Name"
            onChange={onChange}
            value={name}
            required
          />
        </div>

        <div className="mb-5">
          <div className="text-sm mb-1 text-white">プロンプト</div>
          <input
            className="w-full bg-gray-200 rounded border py-1 px-3 outline-none focus:bg-white focus:ring-2 focus:ring-yellow-500"
            type="text"
            name="prompt"
            placeholder="Prompt"
            onChange={onChange}
            value={prompt}
            required
          />
        </div>

        <div className="flex justify-center mb-5">
          {image ? (
            <Image
              src={`data:image/png;base64,${image}`}
              className="rounded"
              alt="image"
              width={400}
              height={400}
            />
          ) : (
            <div className="h-[400px] w-[400px] bg-gray-200 border rounded">
              <div className="flex items-center justify-center h-full text-gray-700">No Image</div>
            </div>
          )}
        </div>

        <div className="text-center mb-5">
          {loadingGenerate ? (
            <Loading />
          ) : name && prompt ? (
            <button
              type="button"
              onClick={generateImage}
              className="w-full text-white bg-green-500 hover:brightness-110 rounded py-1 px-8"
            >
              画像生成
            </button>
          ) : (
            <div className="w-full text-white bg-gray-500 rounded py-1 px-8">画像生成</div>
          )}
        </div>

        <div className="text-center mb-5">
          {loadingPost ? (
            <Loading />
          ) : name && prompt && image ? (
            <button
              type="submit"
              className="w-full text-white bg-yellow-500 hover:brightness-110 rounded py-1 px-8"
            >
              画像投稿
            </button>
          ) : (
            <div className="w-full text-white bg-gray-500 rounded py-1 px-8">画像投稿</div>
          )}
        </div>
      </form>
    </div>
  )
}

export default PostNew
