import { notFound } from 'next/navigation'
import { createClient } from '../../../utils/supabase-server'

import PostItem from './post-item'

// 投稿画像リスト
const PostList = async () => {
  const supabase = createClient()

  // 投稿画像リスト取得
  const { data: postsData } = await supabase
    .from('posts')
    .select()
    .order('created_at', { ascending: false })

  // 投稿画像が見つからない場合
  if (!postsData) return notFound()

  return (
    <div className="flex flex-col items-center justify-center">
      {postsData.map((post) => {
        return <PostItem key={post.id} {...post} />
      })}
    </div>
  )
}

export default PostList
