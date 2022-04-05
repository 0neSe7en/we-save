export const defaultTemplate = `
<html lang="zh">
<head>
  <title>{{title}}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      outline: 0;
    }

    html {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
      line-height: 1.6
    }

    input:matches([type="button"],[type="submit"],[type="reset"]),input[type=file]::-webkit-file-upload-button,button {
      font-family: inherit
    }

    body {
      -webkit-touch-callout: none;
      color: #222;
      letter-spacing: .034em;
      font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei,Arial,sans-serif
    }

    h1,h2,h3,h4,h5,h6 {
      font-weight: 400;
      font-size: 16px
    }

    a {
      color: #576b95;
      text-decoration: none;
      -webkit-tap-highlight-color: rgba(0,0,0,0)
    }

    .export-title {
      font-size: 22px;
      line-height: 1.4;
      margin-bottom: 14px;
    }

    .export-link {
      font-size: 14px;
      font-style: italic;
      word-break: break-all;
    }

  </style>
</head>
<body>
<main style='max-width: 677px; margin: 0 auto'>
<h1 class="export-title">{{msg_title}}</h1>
<span class="export-link">Source: <a href="{{msg_link}}">{{msg_link}}</a></span>
  {{{msg_content}}}
</main>
</body>
</html>
`
