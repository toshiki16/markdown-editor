import * as React from 'react'
import styled from 'styled-components'
import { putMemo } from '../indexeddb/memos'
import { Button } from '../components/button'
import { SaveModal } from '../components/save_modal'
import { Link } from 'react-router-dom'
import { Header } from '../components/header'
import ConvertMarkdownWorker from 'worker-loader!../worker/convert_markdown_worker'

const convertMarkdownWorker = new ConvertMarkdownWorker()
const { useState, useEffect } = React


const Wrapper = styled.div`
bottom: 0;  
left: 0;
  position: fixed;
  right: 0;
top: 3rem;
`

const HeaderArea = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  left: 0;
`

const TextArea = styled.textarea`
  border-right: 1px solid silver;
  border-top: 1px solid silver;
  bottom: 0;
  font-size: 1rem;
  left: 0;
  padding: 0.5rem;
  position: absolute;
  top: 0;
  width: 50vw;
`

const Preview = styled.div`
  border-top: 1px solid silver;
  bottom: 0;
  overflow-y: scroll;
  padding: 1rem;
  position: absolute;
  right: 0;
  top: 0;
  width: 50vw;

  /*メニューバーのところ*/

summary {
  width: 60%;
  margin: 0 auto 5px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  background-color: #eee;
  cursor: pointer;
  transition: 0.2s;
}

summary::after {
  font-family: "Font Awesome 5 Free";
  content: "\f0d7";
  font-weight: 900;
  display: flex;
  align-items: center;
  transition: all 0.3s;
}

.details-content {
  width: 60%;
  margin: 0 auto;
}

.details-content p {
  width: 95%;
}

details[open] summary:after {
  transform: rotate(180deg);
}

details[open] .details-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }

  100% {
    opacity: 1;
  }
}

@media screen and (max-width: 960px) {
  summary {
    width: 90%;
  }

  .details-content {
    width: 90%;
  }

  .details-content p {
    margin: 10px auto 15px;
  }
}

/*ここまで*/

`

interface props {
  text: string
  setText: (text: string) => void
}



export const Editor: React.FC<props> = (props) => {
  const { text, setText } = props
  const [showModal, setShowModal] = useState(false)
  const [html, setHtml] = useState('')



  useEffect(() => {
    convertMarkdownWorker.onmessage = (event) => {
      setHtml(event.data.html)
    }
  }, [])

  useEffect(() => {
    convertMarkdownWorker.postMessage(text)
  }, [text])

  return (
    <>
      <HeaderArea>
        <Header title="PC用のメモ帳的なの兼HTML反映型メモ">
          <Button onClick={() => setShowModal(true)}>
            保存する
          </Button>
          <Link to="/history">
            履歴を見る
          </Link>
        </Header>
      </HeaderArea>
      <Wrapper>
        <TextArea
          onChange={(event) => setText(event.target.value)}
          value={text}
        />
        <Preview>


          <div className="title-container">
            <details>
              <summary>説明</summary>
              <div className="details-content">
                <li>
                  <h3>
                    PC用のメモ帳的なの兼HTML反映型メモ。#(半角空欄)、-(半角空欄)の後にテキスト書くと...
                  </h3>
                  ・HTML文を書くと反映されます。やったことある人は書いてみて～divも反映されると思う<br></br>
                  例（書く時は＜＞を半角にしてね）<br></br>
                  ＜button＞ボタンだよ＜/button＞<br></br>
                  <button>ボタンだよ</button><br></br>

                  ＜a href="https://www.google.com/"＞googleへのパス＜/a＞<br></br>
                  <a href="https://www.google.com/">googleへのパス</a><br></br>

                  ＜button onclick="alert('このボタンを押しやがったな。')"＞押してみ＜/button＞<br></br>
                  どうなるかな<br></br><br></br>
                </li>
              </div>
            </details>
          </div>

          【プレビュー画面↓↓】<br></br>

          <div dangerouslySetInnerHTML={{ __html: html }} />









        </Preview>
      </Wrapper >
      {showModal && (
        <SaveModal
          onSave={(title: string): void => {
            putMemo(title, text)
            setShowModal(false)
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  )
}
