import * as path from 'path'
import * as fs from 'fs-extra'
import { extract } from 'we-extract'
import * as puppeteer from 'puppeteer'
import * as handlebars from 'handlebars'
import axios from 'axios'
import * as cheerio from 'cheerio'
import * as TurndownService from 'turndown'
import { CheerioAPI } from 'cheerio'
import { WeExtractData } from './types'

const images: Map<string, Buffer> = new Map()
const turndownService = new TurndownService({
  hr: '---',
})

let browser: puppeteer.Browser | null = null
let browserPage: puppeteer.Page | null = null

export async function renderHTML(
  extracted: WeExtractData,
  template: string,
  cacheImage?: boolean,
): Promise<CheerioAPI> {
  const html = handlebars.compile(template)(extracted)
  await fs.writeFile('extracted.html', extracted.msg_content, 'utf8')
  const $ = cheerio.load(html)
  await Promise.all(
    $('img').map(async (i, imgEle) => {
      const node = $(imgEle)
      const src = node.attr('data-src')
      if (!src) {
        return
      }
      const { data: buf } = await axios.get<Buffer>(src, {
        responseType: 'arraybuffer',
      })
      if (cacheImage) {
        images.set(src, buf)
      }
      node
        .attr('src', `data:image/png;base64,${buf.toString('base64')}`)
        .attr('width', '100%')
    }),
  )
  return $
}

export async function extractArticle(url: string): Promise<WeExtractData> {
  const { data, done, code, msg } = await extract(url)
  if (!done) {
    throw new Error(msg)
  }
  return data as WeExtractData
}

export function exportToHTML(html: string, path: string) {
  return fs.outputFile(path, html, 'utf-8')
}
export async function exportToPDF(html: string, filePath: string) {
  await fs.ensureDir(path.dirname(filePath))
  if (browserPage) {
    return browserPage.pdf({ path: filePath, format: 'a4' })
  }
  const browser = await puppeteer.launch()
  browserPage = await browser.newPage()
  await browserPage.setContent(html)
  await browserPage.waitForNetworkIdle()
  await browserPage.pdf({ path: filePath, format: 'a4' })
}

export async function exportToMarkdown(
  $: CheerioAPI,
  filePath: string,
  imagePath?: string,
) {
  const imageDir = imagePath
    ? path.join(path.dirname(filePath), imagePath)
    : path.dirname(filePath)
  await fs.ensureDir(imageDir)
  await Promise.all(
    $('img').map(async (i, imgEle) => {
      const node = $(imgEle)
      const src = node.attr('data-src')
      if (!src) {
        return
      }
      const imgName = `${node.attr('data-fileid') || i.toString()}.${node.attr(
        'data-type',
      )}`
      const buf = images.get(src)
      await fs.outputFile(path.join(imageDir, imgName), buf)
      node.attr('src', path.join(imagePath || './', imgName))
    }),
  )
  const markdown = turndownService.turndown($.html())
  await fs.outputFile(filePath, markdown, 'utf-8')
}

export async function cleanup() {
  images.clear()
  if (browserPage) {
    await browserPage.close()
    browserPage = null
  }
  if (browser) {
    await browser.close()
    browser = null
  }
}
