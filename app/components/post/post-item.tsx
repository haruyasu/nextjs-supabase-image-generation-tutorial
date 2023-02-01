'use client'

import { format } from 'date-fns'
import type { PostType } from '../../../utils/post.types'

import Image from 'next/image'

// 投稿アイテム
const PostItem = (post: PostType) => {
  return (
    <div className="break-words border-b border-gray-600 py-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full object-cover bg-yellow-500 flex justify-center items-center text-white text-xs font-bold">
          {post.name[0]}
        </div>
        <div className="font-bold text-white">{post.name}</div>
        <div className="text-gray-300">・</div>
        <div className="text-gray-300 text-sm">
          {format(new Date(post.created_at), 'yyyy/MM/dd HH:mm')}
        </div>
      </div>

      <div className="mb-5">
        <Image src={post.image_url} className="rounded" alt="image" width={512} height={512} />
      </div>

      <div className="text-white">{post.prompt}</div>
    </div>
  )
}

export default PostItem
