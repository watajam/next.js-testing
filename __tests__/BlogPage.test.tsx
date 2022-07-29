/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/extend-expect'
import { render, screen, cleanup } from '@testing-library/react'
import { getPage } from 'next-page-tester'
import { initTestHelpers } from 'next-page-tester'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import 'setimmediate'

initTestHelpers()

//restApiのレスポンスモック定義 //ダミーのレスポンスを返してテストを実行する //getStaticPropsの返り値をモックとして指定してテストを実行する
const handlers = [
  //指定するAPIは、BlogPageと同じものを指定する
  rest.get('https://jsonplaceholder.typicode.com/posts/', (req, res, ctx) => {
    //クエリパラメータを指定
    const query = req.url.searchParams
    const _limit = query.get('_limit')
    if (_limit === '10') {
      //返したいレスポンスを指定
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
]

//サーバーを建てる
const server = setupServer(...handlers)

//モックサーバーを起動する
beforeAll(() => {
  server.listen()
})
//各itのテストケースが終了するたびに呼ばれテスト間の副作用が起きないようにする関数
afterEach(() => {
  server.resetHandlers()
  cleanup()
})
//すべてのテストが終了した時にサーバーを停止する
afterAll(() => {
  server.close()
})

//タイトル作成
describe(`Blog page`, () => {
  //テストケース
  it('Should render the list of blogs pre-fetched by getStaticProps', async () => {
    //blog pageを取得
    const { page } = await getPage({
      route: '/blog-page',
    })
    //render()でページをコンポーネントをラップする事でコンポーネントのHTML構造を取得
    render(page)

    //blog pageのテキストタイトルが表示されているか確認
    expect(await screen.findByText('blog page')).toBeInTheDocument()
    //blog pageのリストにMSWからレスポンスとして返ってデータがDOMに表示されているか確認
    expect(screen.getByText('dummy title 1')).toBeInTheDocument()
    expect(screen.getByText('dummy title 2')).toBeInTheDocument()
  })
})
