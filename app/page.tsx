import { Suspense } from 'react'

import PostList from './components/post/post-list'
import Loading from './loading'

// メインページ
const Page = () => {
  return (
    <div className="h-full">
      <Suspense fallback={<Loading />}>
        {/* @ts-ignore*/}
        <PostList />
      </Suspense>
    </div>
  )
}

export default Page
