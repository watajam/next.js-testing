/**
 * @jest-environment jsdom
 */
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { SWRConfig } from 'swr'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import CommentPage from '../pages/comment-page'
import 'setimmediate'

const server = setupServer(
  //MSWでAXIOSのレスポンスをモック
  rest.get(
    'https://jsonplaceholder.typicode.com/comments/',
    (req, res, ctx) => {
      const query = req.url.searchParams
      const _limit = query.get('_limit')
      if (_limit === '10') {
        return res(
          ctx.status(200),
          ctx.json([
            {
              postId: 1,
              id: 1,
              name: 'A',
              email: 'dummya@gmail.com',
              body: 'test body a',
            },
            {
              postId: 2,
              id: 2,
              name: 'B',
              email: 'dummyb@gmail.com',
              body: 'test body b',
            },
          ])
        )
      }
    }
  )
  // rest.get(
  //   'https://jsonplaceholder.typicode.com/comments/?_limit=10',
  //   (req, res, ctx) => {
  //     return res(
  //       ctx.status(200),
  //       ctx.json([
  //         {
  //           postId: 1,
  //           id: 1,
  //           name: 'A',
  //           email: 'dummya@gmail.com',
  //           body: 'test body a',
  //         },
  //         {
  //           postId: 2,
  //           id: 2,
  //           name: 'B',
  //           email: 'dummyb@gmail.com',
  //           body: 'test body b',
  //         },
  //       ])
  //     )
  //   }
  // )
)

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  cleanup()
})
afterAll(() => server.close())

//テスト内容：(ListItem(Comment）にモックのデータが200番でレスポンスが返ってきた場合はしっかりレンダリングできているか検証 ＆
// レスポンスが400番のBatリクエストで失敗した場合はerrorのテキストがブラウザに表示しているか検証)
describe('Comment page with useSWR / Success+Error', () => {
  //テストケース: レスポンスが200番でレスポンスが返ってきた場合(useSWRが正常に動作しているか検証)
  it('Should render the value fetched by useSWR ', async () => {
    //ページ取得
    render(
      //useSWRの機能もてテストしたい場合は、SWRConfigを使う
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <CommentPage />
      </SWRConfig>
    )
    //ページにデータが表示されているか検証
    expect(await screen.findByText('1: test body a')).toBeInTheDocument()
    expect(screen.getByText('2: test body b')).toBeInTheDocument()
  })

  //テストケース: レスポンスが400番のBatリクエストで失敗した場合(useSWRが正常に動作しているか検証)
  it('Should render Error text when fetch failed', async () => {
    //デフォルトで作成したサーバーのレスポンスを上書きする必要がある
    //フェールしたレスポンスをモックする
    server.use(
      rest.get(
        'https://jsonplaceholder.typicode.com/comments/',
        (req, res, ctx) => {
          const query = req.url.searchParams
          const _limit = query.get('_limit')
          if (_limit === '10') {
            return res(ctx.status(400))
          }
        }
      )
      // rest.get(
      //   'https://jsonplaceholder.typicode.com/comments/?_limit=10',
      //   (req, res, ctx) => {
      //     return res(ctx.status(400))
      //   }
      // )
    )
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <CommentPage />
      </SWRConfig>
    )
    expect(await screen.findByText('Error!')).toBeInTheDocument()
    //screen.debug()
  })
})
