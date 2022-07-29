/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event' //ユーザーに対して要素をクリックさせるテストの際に必要
import { getPage } from 'next-page-tester'
import { initTestHelpers } from 'next-page-tester' //初期設定を行う
import 'setimmediate'

//実行する必要がある
initTestHelpers()

//ページ遷移をテストする
describe('Navigation by Link', () => {
  //describeでテストをグループ化する:タイトルを指定する
  it('Should route to selected page in navbar', async () => {
    //テストケースを定義する　//next-page-testerはasyncを使用する
    const { page } = await getPage({
      //getPage()でページを取得する
      route: '/index',
    })
    render(page) //render()でページをコンポーネントをラップする事でコンポーネントのHTML構造を取得

    //blog-pageページに遷移した際に、blog-pageのタイトルが表示されていたら遷移できているテストケースを実行する
    userEvent.click(screen.getByTestId('blog-nav')) //screen.getByTestId('blog-nav')で指定したIDの要素を取得し、userEvent.click()でシュミレーションクリックする
    expect(await screen.findByText('blog page')).toBeInTheDocument() //screen.findByText()でHTMLの文字列を取得するして、toBeInTheDocument()で要素が存在するかを判定する //※非同期の場合はgetByTextではなく、findByText()でawaitで実行する

    screen.debug() //screen.debug()でページのHTML構造を取得する
    userEvent.click(screen.getByTestId('comment-nav'))
    expect(await screen.findByText('comment page')).toBeInTheDocument()
    userEvent.click(screen.getByTestId('context-nav'))
    expect(await screen.findByText('context page')).toBeInTheDocument()
    userEvent.click(screen.getByTestId('task-nav'))
    expect(await screen.findByText('todos page')).toBeInTheDocument()
    userEvent.click(screen.getByTestId('home-nav'))
    expect(await screen.findByText('Wellcome to Nextjs')).toBeInTheDocument()
  })
})
