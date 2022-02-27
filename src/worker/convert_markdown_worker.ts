// import * as marked from 'marked'
import * as sanitizeHtml from 'sanitize-html'
const { marked } = require('marked')

const worker: Worker = self as any

let count: number = 1
while (count < 1_000_000_000) { // 先程設定した値に合わせてください
    count++
}


worker.addEventListener('message', (event) => {
    const text = event.data
    const html = sanitizeHtml(marked(text), { allowedTags: [...sanitizeHtml.defaults.allowedTags, 'h1', 'h2'] })
    worker.postMessage({ html })
})
