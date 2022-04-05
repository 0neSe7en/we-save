# we-save
保存微信公众号文章为PDF、Markdown或者HTML

## Install

```bash
$ npm i we-save -g
```

## Usage

```bash
$ wesave -u https://mp.weixin.qq.com/s/G3fueJQF2Yy2_hD3IaySsQ test.pdf test.md test.html
```

```
Usage: WeSave [options] [files...]

将微信公众号的文章保存为可离线访问的Markdown、HTML、PDF文件

Options:
  -V, --version              output the version number
  -u, --url <url>            微信公众号文章链接
  -t, --template [template]  HTML模板
  --image-dir [imageDir]     图片相对目标文件的保存目录。只对Markdown文件有效，默认为Markdown文件所在目录
  -h, --help                 display help for command
```

- `template`: [Handlebars](https://handlebarsjs.com/) 模板。默认模板为 [defaultTemplate.ts](https://github.com/0neSe7en/we-save/blob/master/src/defaultTemplate.ts)
