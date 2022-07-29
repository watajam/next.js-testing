/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/extend-expect'
import { render, screen, cleanup } from '@testing-library/react'
import { getPage } from 'next-page-tester'
import { initTestHelpers } from 'next-page-tester'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import userEvent from '@testing-library/user-event'
import 'setimmediate'

initTestHelpers()

//MSWでAPIのレスポンスをモック
const handlers = [
  rest.get('https://jsonplaceholder.typicode.com/posts/', (req, res, ctx) => {
    const query = req.url.searchParams
    const _limit = query.get('_limit')
    if (_limit === '10') {
      return res(
        ctx.status(200),
        ctx.json([
          {
            userId: 1,
            id: 1,
            title: 'dummy title 1',
            body: 'dummy body 1',
          },
          {
            userId: 2,
            id: 2,
            title: 'dummy title 2',
            body: 'dummy body 2',
          },
        ])
      )
    }
  }),
  // rest.get(
  //   'https://jsonplaceholder.typicode.com/posts/?_limit=10',
  //   (req, res, ctx) => {
  //     return res(
  //       ctx.status(200),
  //       ctx.json([
  //         {
  //           userId: 1,
  //           id: 1,
  //           title: 'dummy title 1',
  //           body: 'dummy body 1',
  //         },
  //         {
  //           userId: 2,
  //           id: 2,
  //           title: 'dummy title 2',
  //           body: 'dummy body 2',
  //         },
  //       ])
  //     )
  //   }
  // ),

  //詳細ページのレスポンスモック定義
  rest.get('https://jsonplaceholder.typicode.com/posts/1', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        userId: 1,
        id: 1,
        title: 'dummy title 1',
        body: 'dummy body 1',
      })
    )
  }),
  rest.get('https://jsonplaceholder.typicode.com/posts/2', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        userId: 2,
        id: 2,
        title: 'dummy title 2',
        body: 'dummy body 2',
      })
    )
  }),
]

//サーバーを建てる
const server = setupServer(...handlers)

beforeAll(() => {
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
  cleanup()
})
afterAll(() => {
  server.close()
})

describe(`Blog detail page`, () => {
  //1.ID１の詳細ページを取得しテキストを確認するテスト
  it('Should render detailed content of ID 1', async () => {
    const { page } = await getPage({
      route: '/posts/1',
    })
    render(page)
    expect(await screen.findByText('dummy title 1')).toBeInTheDocument()
    expect(screen.getByText('dummy body 1')).toBeInTheDocument()
    //取得したページのHTML構造を取得
    // screen.debug()
  })

  //2.ID2の詳細ページを取得しテキストを確認するテスト
  it('Should render detailed content of ID 2', async () => {
    const { page } = await getPage({
      route: '/posts/2',
    })
    render(page)
    expect(await screen.findByText('dummy title 2')).toBeInTheDocument()
    expect(screen.getByText('dummy body 2')).toBeInTheDocument()
  })

 //3.ID2の詳細ページを取得しテキストを確認し「Backボタン」でホームページに戻りテキストを確認するテスト
  it('Should route back to blog-page from detail page', async () => {
    const { page } = await getPage({
      route: '/posts/2',
    })
    render(page)
    //ページ遷移するまで待つ
    await screen.findByText('dummy title 2')
    //ボタンをクリックする
    userEvent.click(screen.getByTestId('back-blog'))
    expect(await screen.findByText('blog page')).toBeInTheDocument()
  })
})
