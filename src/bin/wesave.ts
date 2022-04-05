#!/usr/bin/env node

import { Command } from 'commander'
import * as fs from 'fs-extra'
import * as process from 'process'
import {
  cleanup,
  exportToHTML,
  exportToMarkdown,
  exportToPDF,
  extractArticle,
  renderHTML,
} from '../index'
import { defaultTemplate } from '../defaultTemplate'
import { ProgramOptions } from '../types'

async function main(files: string[], options: ProgramOptions) {
  let template: string = defaultTemplate
  if (options.template) {
    if (!(await fs.pathExists(options.template))) {
      throw new Error('Template file does not exist')
    }
    template = await fs.readFile(options.template, 'utf8')
  }

  const extracted = await extractArticle(options.url)
  const cacheImage = files.some((f) => f.endsWith('.md'))
  const $ = await renderHTML(extracted, template, cacheImage)
  for (const file of files) {
    console.log('Exporting to', file)
    if (file.endsWith('.md')) {
      await exportToMarkdown($.load($.html()), file, options.imageDir)
    } else if (file.endsWith('.pdf')) {
      await exportToPDF($.html(), file)
    } else if (file.endsWith('.html') || file.endsWith('.htm')) {
      await exportToHTML($.html(), file)
    }
  }
  await cleanup()
  console.log('All Done!')
}

const program = new Command()

program
  .name('WeSave')
  .version('0.1.0')
  .description('将微信公众号的文章保存为可离线访问的Markdown、HTML、PDF文件')

program
  .argument('[files...]')
  .requiredOption('-u, --url <url>', '微信公众号文章链接')
  .option('-t, --template [template]', 'HTML模板')
  .option(
    '--image-dir [imageDir]',
    '图片相对目标文件的保存目录。只对Markdown文件有效，默认为Markdown文件所在目录',
  )
  .action(async (files) => {
    if (!files.length) {
      // output error
      program.error('No files specified')
    }
    try {
      await main(files, program.opts())
      process.exit(0)
    } catch (e) {
      if (e instanceof Error) {
        program.error(e.message)
      } else {
        throw e
      }
    }
  })

program.parse(process.argv)
