/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Post from '../components/Post'
import { POST } from '../types/Types'
import 'setimmediate'

//受け取ったPoropsがレンダリングされているかを確認する
describe('Post component with given props', () => {
  //ダミーPropsデータを作成する
  let dummyProps: POST
  //dummyPropsの中に擬似的Propsのコンテンツを定義する
  beforeEach(() => {
    dummyProps = {
      userId: 1,
      id: 1,
      title: 'dummy title 1',
      body: 'dummy body 1',
    }
  })
  it('Should render correctly with given props value', () => {
    //dummyPropsを渡してPostコンポーネントをレンダリングする
    render(<Post {...dummyProps} />)
    //Propsのデータがレンダリングされているかを確認する
    // id: 1,
    expect(screen.getByText(dummyProps.id)).toBeInTheDocument()
    // title: 'dummy title 1',
    expect(screen.getByText(dummyProps.title)).toBeInTheDocument()
    //screen.debug()
  })
})
