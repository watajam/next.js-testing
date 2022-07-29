import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Home from '../pages/index'

//index.tsxページにHello Next.jsが表示されているかを確認する
//itでテストを定義する
it('Should render hello text', () => {
  render(<Home />) //render()でページをコンポーネントをラップする事でコンポーネントのHTML構造を取得
  screen.debug()
  expect(screen.getByText('Wellcome to Nextjs')).toBeInTheDocument() //getByText()でHTMLの文字列を取得するして、toBeInTheDocument()で要素が存在するかを判定する
})